import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EChartOption } from 'echarts';
import { ApiService } from 'src/app/utils/services/api.service';
import { JSONataResponse } from 'src/app/utils/models/url';
import * as _ from 'lodash';


export interface Hour {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-dialog-date-time',
  templateUrl: './dialog-date-time.component.html',
  styleUrls: ['./dialog-date-time.component.scss']
})
export class DialogDateTimeComponent implements OnInit {
  dataDate: string[] = []
  dataDateLength: number[] = []
  geoPoints: any = {}
  dataDateToFind: Date
  options: EChartOption = {}
  Months: any[] = [
    { value: 0, viewValue: 'Enero' },
    { value: 1, viewValue: 'Febrero' },
    { value: 2, viewValue: 'Marzo' },
    { value: 3, viewValue: 'Abril' },
    { value: 4, viewValue: 'Mayo' },
    { value: 5, viewValue: 'Junio' },
    { value: 6, viewValue: 'Julio' },
    { value: 7, viewValue: 'Agosto' },
    { value: 8, viewValue: 'Septiembre' },
    { value: 9, viewValue: 'Octubre' },
    { value: 10, viewValue: 'Noviembre' },
    { value: 11, viewValue: 'Diciembre' }
  ];
  currentMonth: number
  showMessage: Boolean = false
  message: String

  form = '5dc341823153fa33d0225b11';
  routes: any[];
  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<DialogDateTimeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.init();
  }

  async monthSelected() {
    this.dataDate = [];
    this.dataDateLength = [];
    this.options = {};

    let CurrentDate = new Date();
    let startDate = new Date(
      CurrentDate.getFullYear(),
      this.currentMonth,
      1,
      0,
      0,
      0,
      0
    );
    let endDate = new Date(
      CurrentDate.getFullYear(),
      this.currentMonth + 1,
      1,
      0,
      0,
      0,
      0
    );
    let geoPoint = [];
    for (const route of this.routes) {
      route.data = await this.apiService
        .get('/data/open/vm2', {
          query: `this.data`,
          additionalFilters: JSON.stringify([
            { trackedObject: route.id },
            { createdAt: { gte: +startDate } },
            { createdAt: { lte: +endDate } },
          ]),
        })
        .toPromise();

      for (const datum of route.data) {
        const newDate = new Date(datum.createdAt);
        datum._date = `${newDate.getDate() > 9 ? newDate.getDate() : '0' + newDate.getDate()}/${(newDate.getMonth() + 1) > 9 ? (newDate.getMonth() + 1) : '0' + (newDate.getMonth() + 1)}/${newDate.getFullYear()}`;
        datum._geoPoint = { lat: datum.latitude, lon: datum.longitude };
        geoPoint.push(datum);
      }
      //console.log(Object.keys(_.groupBy(route.data, (datum) => datum._date)));
      //console.log(_.groupBy(route.data, (datum) => datum._date));
    }

    this.geoPoints = _.groupBy(geoPoint, (datum) => datum._date);
    this.dataDate = Object.keys(this.geoPoints);
    this.dataDate.sort(function (a, b) {
      a = a.split('/').reverse().join('');
      b = b.split('/').reverse().join('');
      return a > b ? 1 : a < b ? -1 : 0;
    });
    for (let key in this.dataDate) {
      this.dataDateLength.push(this.geoPoints[this.dataDate[key]].length);
    }

    this.message = 'There aren\'t data to show in ' + this.Months[this.currentMonth].viewValue + '!'
    this.showMessage = this.dataDateLength.length === 0
    if (!this.showMessage) {
      this.completeOption();
    }

  }

  chartClick(ev) {
    //console.log('Chart clicked:', ev);
    this.dataDateToFind = new Date(this.geoPoints[ev.name][0].createdAt)
    this.data.startDate = new Date(
      this.dataDateToFind.getFullYear(),
      this.dataDateToFind.getMonth(),
      this.dataDateToFind.getDate(),
      0,
      0,
      0,
      0
    );
    this.data.endDate = new Date(
      this.dataDateToFind.getFullYear(),
      this.dataDateToFind.getMonth(),
      this.dataDateToFind.getDate() + 1,
      0,
      0,
      0,
      0
    );
    //console.log(this.data.startDate);
    //console.log(this.data.endDate);
    //this.dialogRef.close();
  }

  completeOption() {
    this.options = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: this.dataDate,
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: 'Puntos Capturados',
          type: 'bar',
          data: this.dataDateLength,
        },
      ],
    };
  }

  async init() {
    let geoPoint = [];

    await this.apiService
      .get('/elements/open/jsonata', {
        query: `([$[form="${this.form}"]])`,
      })
      .toPromise()
      .then((routes: JSONataResponse) => {
        this.routes = routes.data;
      });
    for (const route of this.routes) {
      route.data = await this.apiService
        .get('/data/open/vm2', {
          query: `this.data`,
          additionalFilters: JSON.stringify([
            { trackedObject: route.id }
          ]),
        })
        .toPromise();

      for (const datum of route.data) {
        const newDate = new Date(datum.createdAt);
        datum._date = `${newDate.getDate() > 9 ? newDate.getDate() : '0' + newDate.getDate()}/${(newDate.getMonth() + 1) > 9 ? (newDate.getMonth() + 1) : '0' + (newDate.getMonth() + 1)}/${newDate.getFullYear()}`;
        datum._geoPoint = { lat: datum.latitude, lon: datum.longitude };
        geoPoint.push(datum);
      }
      //console.log(Object.keys(_.groupBy(route.data, (datum) => datum._date)));
      //console.log(_.groupBy(route.data, (datum) => datum._date));
    }

    this.geoPoints = _.groupBy(geoPoint, (datum) => datum._date);
    this.dataDate = Object.keys(this.geoPoints);
    this.dataDate.sort(function (a, b) {
      a = a.split('/').reverse().join('');
      b = b.split('/').reverse().join('');
      return a > b ? 1 : a < b ? -1 : 0;
    });
    for (let key in this.dataDate) {
      this.dataDateLength.push(this.geoPoints[this.dataDate[key]].length);
    }

    this.showMessage = this.dataDateLength.length === 0
    if (!this.showMessage) {
      this.completeOption();
    }

  }

}
