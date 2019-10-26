import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GeoJSON } from 'leaflet';
import { ApiService } from 'src/app/utils/services/api.service';
import { JSONataResponse } from 'src/app/utils/models/url';
import { DatePipe } from '@angular/common';

interface SensorAxis {
  name: string;
  title: string;
}

interface Axis {
  id: string;
  name: string;
  active: boolean;
  dataLoaded: boolean;
  data: any[];
  sensors: SensorAxis[];
  activeSensors: string[];
}

class WQMonitoringPointAxis implements Axis {
  sensors = [
    { name: 'icampff', title: 'ICAMpff' },
    { name: 'dissolvedOxygen', title: 'Oxígeno disuelto' },
    { name: 'nitrate', title: 'Nitratos' },
    { name: 'totalSuspendedSolids', title: 'Sólidos suspendidos totales' },
    { name: 'thermotolerantColiforms', title: 'Coliformes termotolerantes' },
    { name: 'pH', title: 'pH' },
    { name: 'chrolophyllA', title: 'Clorofila A' },
    { name: 'biochemicalOxygenDemand', title: 'Demanda bioquímica de oxígeno' },
    { name: 'phosphates', title: 'Fosfatos' },
  ];
  activeSensors: string[] = [];
  constructor(
    public id: string,
    public name: string,
    public active: boolean,
    public dataLoaded: boolean,
    public data: any[],
  ) {}
}

class WaterBodyAxis implements Axis {
  sensors = [{ name: 'icampff', title: 'ICAMpff' }];
  activeSensors: string[] = ['icampff'];
  constructor(
    public id: string,
    public name: string,
    public active: boolean,
    public dataLoaded: boolean,
    public data: any[],
  ) {}
}

@Component({
  selector: 'app-aquapp-export-data',
  templateUrl: './aquapp-export-data.component.html',
  styleUrls: ['./aquapp-export-data.component.scss'],
})
export class AquappExportDataComponent implements OnInit, AfterViewInit {
  options: any = {};
  colors = ['#51B53F', '#B53F51', '#B5683F', '#B5A33F', '#8BB53F'];
  textColor = 'black';
  axisLineColor = 'black';
  splitLineColor = 'black';
  xAxis: number[] = [];
  yAxisList: Axis[] = [];
  waterBodies: any[];
  idToWaterBodyGeoJSON: { [prop: string]: GeoJSON<any> } = {};
  icampffs: { [prop: string]: { [prop: number]: number } } = {};
  wqMonitoringPoints: any[] = [];
  icampffDates: number[] = [];

  constructor(private apiService: ApiService, private datePipe: DatePipe) {}

  ngOnInit() {
    this.getElements();
  }

  configureChart() {
    const series = [];
    const legendNames = [];
    for (const axis of this.yAxisList) {
      for (const activeSensor of axis.activeSensors) {
        const name = `${axis.name}, ${
          axis.sensors.find(s => s.name === activeSensor).title
        }`;
        series.push({
          name,
          type: 'line',
          data: axis.data.map(d => d[activeSensor]),
        });
        legendNames.push(name);
      }
    }
    this.options = {
      backgroundColor: 'transparent',
      color: this.colors,
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}',
      },
      legend: {
        left: 'left',
        data: legendNames,
        textStyle: {
          color: this.textColor,
        },
      },
      xAxis: [
        {
          type: 'category',
          data: this.icampffDates,
          axisTick: {
            alignWithLabel: true,
          },
          axisLine: {
            lineStyle: {
              color: this.axisLineColor,
            },
          },
          axisLabel: {
            textStyle: {
              color: this.textColor,
            },
            formatter: (date: number) =>
              this.datePipe.transform(date, 'shortDate'),
          },
        },
      ],
      yAxis: [
        {
          type: 'log',
          axisLine: {
            lineStyle: {
              color: this.axisLineColor,
            },
          },
          splitLine: {
            lineStyle: {
              color: this.splitLineColor,
            },
          },
          axisLabel: {
            textStyle: {
              color: this.textColor,
            },
          },
        },
      ],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      series,
    };
  }

  ngAfterViewInit() {}

  getElements() {
    const promises = [];
    promises.push(
      this.apiService
        .get(`/elements/open/jsonata`, {
          query: `([$])`,
          additionalFilters: JSON.stringify([
            { category: 'tracked-objects' },
            { form: '5dacb798a52adb394573ca70' },
          ]),
        })
        .toPromise()
        .then((response: JSONataResponse) => {
          this.wqMonitoringPoints = response.data;
          this.wqMonitoringPoints.forEach(wq => {
            this.yAxisList.push(
              new WQMonitoringPointAxis(wq.id, wq.name, false, false, []),
            );
          });
        })
        .catch(),
    );
    promises.push(
      this.apiService
        .get(`/elements/open/jsonata`, {
          query: `([$])`,
          additionalFilters: JSON.stringify([
            { category: 'tracked-objects' },
            { form: '5dac93e7e67d5a13c95a99ed' },
          ]),
        })
        .toPromise()
        .then((response: JSONataResponse) => {
          this.waterBodies = response.data;
        })
        .catch(),
    );
    Promise.all(promises).then(() => {
      this.getIcampffs();
    });
  }

  getIcampffs() {
    const puntosDeMonitoreo = [];
    for (const waterBody of this.waterBodies) {
      for (const puntoDeMonitoreo of waterBody.puntosDeMonitoreo) {
        if (puntosDeMonitoreo.indexOf(puntoDeMonitoreo) === -1) {
          puntosDeMonitoreo.push(puntoDeMonitoreo);
        }
      }
    }
    this.apiService
      .get('/data/open/vm2', {
        query: `this.data`,
        additionalFilters: JSON.stringify([
          {
            trackedObject: {
              inq: puntosDeMonitoreo,
            },
          },
        ]),
      })
      .subscribe({
        next: (data: any[]) => {
          const wqPointsAxisMap: { [prop: string]: WQMonitoringPointAxis } = {};
          for (const axis of this.yAxisList) {
            if (axis instanceof WQMonitoringPointAxis) {
              wqPointsAxisMap[axis.id] = axis;
            }
          }
          for (const datum of data) {
            if (
              datum.date !== undefined &&
              this.icampffDates.indexOf(datum.date) === -1
            ) {
              this.icampffDates.push(datum.date);
            }
            const axis: WQMonitoringPointAxis | undefined =
              wqPointsAxisMap[datum.trackedObject];
            if (axis !== undefined) {
              axis.data.push(datum);
            }
          }
          for (const key of Object.keys(wqPointsAxisMap)) {
            wqPointsAxisMap[key].data.sort((a: any, b: any) => a.date - b.date);
            wqPointsAxisMap[key].dataLoaded = true;
          }
          for (const waterBody of this.waterBodies) {
            this.icampffs[waterBody.id] = {};
            for (const date of this.icampffDates) {
              const filteredData = data.filter(d => d.date === date);
              const icampffPerMonitoringPoint = waterBody.puntosDeMonitoreo
                .map((mp: string) => {
                  const dataForThisDate = filteredData.find(
                    (d: any) => d.trackedObject === mp,
                  );
                  return dataForThisDate === undefined
                    ? -1
                    : dataForThisDate.icampff;
                })
                .filter((ic: number) => ic !== -1);
              this.icampffs[waterBody.id][
                date
              ] = icampffPerMonitoringPoint.length
                ? icampffPerMonitoringPoint.reduce(
                    (pv: number, cv: number) => pv + cv,
                  ) / icampffPerMonitoringPoint.length
                : -1;
            }
          }
          this.icampffDates.sort((a: number, b: number) => a - b);
          this.waterBodies.forEach(wb => {
            this.yAxisList.push(
              new WaterBodyAxis(
                wb.id,
                wb.name,
                true,
                true,
                this.icampffDates.map((date: number) => ({
                  icampff: this.icampffs[wb.id][date],
                })),
              ),
            );
          });
          console.log(JSON.stringify(this.yAxisList, undefined, 2));
          this.configureChart();
        },
      });
  }
}
