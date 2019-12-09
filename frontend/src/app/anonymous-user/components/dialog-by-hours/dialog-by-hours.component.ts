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
  selector: 'app-dialog-by-hours',
  templateUrl: './dialog-by-hours.component.html',
  styleUrls: ['./dialog-by-hours.component.scss']
})
export class DialogByHoursComponent implements OnInit {

  form = '5dc341823153fa33d0225b11';
  routes: any[];
  points: any[];
  routesIds: String[];
  geoPoints: any = {}
  dataDate: string[] = []
  dataDateLength: number[] = []
  showMessage: Boolean = false
  showContent: Boolean = false
  message: String
  options: EChartOption = {}
  month: string[] = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
   "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
  title: string
  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<DialogByHoursComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }
  ngOnInit() {
    //console.log(this.data)
    this.title = this.month[this.data.startDate.getMonth()]+' '+this.data.startDate.getDate() + ', '+
     this.data.startDate.getFullYear();
    this.init();
  }

  async init() {
    let geoPoint = [];
    this.showContent = false
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
          { createdAt: { gte: +this.data.startDate } },
          { createdAt: { lte: +this.data.endDate } },
        ]),
      })
      .toPromise();
    //console.log(this.points);

    for (const datum of this.points) {
      const newDate = new Date(datum.createdAt);
      datum._hour = `${newDate.getHours() < 12 ? newDate.getHours()+':00 AM' : newDate.getHours() - 12+':00 PM' }`;
      datum._geoPoint = { lat: datum.latitude, lon: datum.longitude };
      geoPoint.push(datum);
    }
    //console.log(_.groupBy(geoPoint, (datum) => datum._hour));
    this.geoPoints = _.groupBy(geoPoint, (datum) => datum._hour);
    this.dataDate = Object.keys(this.geoPoints);
    for (let key of this.dataDate) {
      this.dataDateLength.push(this.geoPoints[key].length);
    }
    //console.log(this.dataDate)
    //console.log(this.dataDateLength)
    
    this.showMessage = this.dataDateLength.length === 0
    if (!this.showMessage) {
      this.completeOption();
    }
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


  chartClick(ev) {
    /*console.log('Chart clicked:', ev);
    console.log(ev.name);
    console.log(ev.name[0], ev.name[1],ev.name[ev.name.length - 2] ,ev.name[ev.name.length - 1]);*/
    let hourString = ev.name[0]+ ev.name[1];
    let hour: number;
    let meridian = ev.name[ev.name.length - 2]  + ev.name[ev.name.length - 1];
    hour = parseInt(hourString);
    if(meridian === 'PM'){
      hour += 12;
    }
    
    this.data.startDateHour = new Date(
      this.data.startDate.getFullYear(),
      this.data.startDate.getMonth(),
      this.data.startDate.getDate(),
      hour,0,0,0
    );
    let startDateHour = new Date(
      this.data.startDate.getFullYear(),
      this.data.startDate.getMonth(),
      this.data.startDate.getDate(),
      hour,0,0,0
    );
    this.data.endDateHour = new Date(startDateHour.setHours(startDateHour.getHours() + 1));
  }
}
