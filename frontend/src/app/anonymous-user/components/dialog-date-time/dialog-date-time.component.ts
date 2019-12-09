import { Component, OnInit, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatProgressSpinnerModule
} from '@angular/material';
import { EChartOption } from 'echarts';
import { ApiService } from 'src/app/utils/services/api.service';
import { JSONataResponse } from 'src/app/utils/models/url';
import * as _ from 'lodash';


@Component({
  selector: 'app-dialog-date-time',
  templateUrl: './dialog-date-time.component.html',
  styleUrls: ['./dialog-date-time.component.scss']
})
export class DialogDateTimeComponent implements OnInit {

  dataDate: string[] = []
  routesIds: string[] = []
  dataDateLength: number[] = []
  startDate: Date
  endDate: Date
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
  points: any[]
  Years: any[] = [
    { value: 2019, viewValue: 2019 },
  ];
  currentMonth: number
  currentYear: number
  showMessage: Boolean = false
  showContent: Boolean = false
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
    this.currentMonth = new Date().getMonth()
    this.currentYear = new Date().getFullYear()
    this.init();
  }

  dateTofind() {
    this.startDate = new Date(
      this.currentYear,
      this.currentMonth,
      1,
      0,
      0,
      0,
      0
    );

    var newdate = new Date(this.startDate);
    newdate.setMonth(newdate.getMonth() + 1);
    var nd = new Date(newdate);
    this.endDate = new Date(
      nd.getFullYear(),
      nd.getMonth(),
      1,
      0,
      0,
      0,
      0
    );
  }

  async monthSelected() {
    this.showContent = false
    this.dataDate = [];
    this.dataDateLength = [];
    this.options = {};

    this.dateTofind();
    let geoPoint = [];


    //console.log(this.routes)
    this.message = 'There aren\'t data to show in ' + this.Months[this.currentMonth].viewValue + '!'
    //console.log(this.routes.length > 0, this.routes.length)
    
    //console.log(new Date(route.createdAt))
    this.points = await this.apiService
      .get('/data/open/vm2', {
        query: `this.data`,
        additionalFilters: JSON.stringify([
          {
            trackedObject: {
              inq: this.routesIds,
            },
          },
          { createdAt: { gte: +this.startDate } },
          { createdAt: { lte: +this.endDate } },
        ]),
      })
      .toPromise();


    if (this.points.length > 0) {
      for (const datum of this.points) {
        const newDate = new Date(datum.createdAt);
        datum._date = `${newDate.getDate() > 9 ? newDate.getDate() : '0' + newDate.getDate()}/${(newDate.getMonth() + 1) > 9 ? (newDate.getMonth() + 1) : '0' + (newDate.getMonth() + 1)}/${newDate.getFullYear()}`;
        datum._geoPoint = { lat: datum.latitude, lon: datum.longitude };
        geoPoint.push(datum);
      }
      //console.log(Object.keys(_.groupBy(route.data, (datum) => datum._date)));
      //console.log(_.groupBy(route.data, (datum) => datum._date));


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
    } else {
      this.showMessage = this.points.length === 0
      this.showContent = true
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
    this.showContent = true
  }

  async init() {
    let geoPoint = [];
    this.showContent = false
    this.dateTofind();
    await this.apiService
      .get('/elements/open/jsonata', {
        query: `([$[form="${this.form}"]])`,
      })
      .toPromise()
      .then((routes: JSONataResponse) => {
        //console.log(routes);
        this.routes = routes.data;
      });
    let routeIds = []
    for (const route of this.routes) {
      routeIds.push(route.id);
    }
    this.routesIds = routeIds;
    //console.log(new Date(route.createdAt))
    this.points = await this.apiService
      .get('/data/open/vm2', {
        query: `this.data`,
        additionalFilters: JSON.stringify([
          {
            trackedObject: {
              inq: this.routesIds,
            },
          },
          { createdAt: { gte: +this.startDate } },
          { createdAt: { lte: +this.endDate } },
        ]),
      })
      .toPromise();
    for (const datum of this.points) {
      const newDate = new Date(datum.createdAt);
      datum._date = `${newDate.getDate() > 9 ? newDate.getDate() : '0' + newDate.getDate()}/${(newDate.getMonth() + 1) > 9 ? (newDate.getMonth() + 1) : '0' + (newDate.getMonth() + 1)}/${newDate.getFullYear()}`;
      datum._geoPoint = { lat: datum.latitude, lon: datum.longitude };
      geoPoint.push(datum);
    }
    //console.log(Object.keys(_.groupBy(route.data, (datum) => datum._date)));
    //console.log(_.groupBy(route.data, (datum) => datum._date));


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
