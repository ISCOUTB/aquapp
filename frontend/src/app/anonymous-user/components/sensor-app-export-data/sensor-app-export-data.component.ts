import { Component, OnInit } from '@angular/core';
import { EChartOption } from 'echarts';
import { ApiService } from 'src/app/utils/services/api.service';
import { JSONataResponse } from 'src/app/utils/models/url';
import * as _ from 'lodash';

@Component({
  selector: 'app-sensor-app-export-data',
  templateUrl: './sensor-app-export-data.component.html',
  styleUrls: [ './sensor-app-export-data.component.scss' ],
})
export class SensorAppExportDataComponent implements OnInit {
  options: EChartOption = {
    color: [ '#3398DB' ],
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
        data: [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ],
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
        name: '直接访问',
        type: 'bar',
        data: [ 10, 52, 200, 334, 390, 330, 220 ],
      },
    ],
  };
  form = '5dc341823153fa33d0225b11';
  routes: any[];
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.init();
  }

  chartClick(ev) {
    console.log('Chart clicked:', ev);
  }

  async init() {
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
          additionalFilters: JSON.stringify([ { trackedObject: route.id } ]),
        })
        .toPromise();
      let i = 0;
      for (const datum of route.data) {
        const newDate = new Date(datum.createdAt);
        newDate.setMonth(11);
        newDate.setDate(i > 2 ? newDate.getDate() + i - 2 : newDate.getDate());
        datum.createdAt = +newDate;
        datum._date = `${newDate.getFullYear()}-${newDate.getMonth()}-${newDate.getDate()}`;
        i++;
      }
      console.log(_.groupBy(route.data, (datum) => datum._date));
    }
  }
}
