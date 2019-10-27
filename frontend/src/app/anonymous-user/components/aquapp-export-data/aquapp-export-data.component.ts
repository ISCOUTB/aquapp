import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GeoJSON } from 'leaflet';
import { ApiService } from 'src/app/utils/services/api.service';
import { JSONataResponse } from 'src/app/utils/models/url';
import { DatePipe } from '@angular/common';
import { EChartOption } from 'echarts';

interface SensorAxis {
  name: string;
  title: string;
}

interface Axis {
  id: string;
  name: string;
  type: string;
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
    public type: string,
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
    public type: string,
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
  options: EChartOption = {};
  colors = [
    '#e6194b',
    '#3cb44b',
    '#ffe119',
    '#4363d8',
    '#f58231',
    '#911eb4',
    '#46f0f0',
    '#f032e6',
    '#bcf60c',
    '#fabebe',
    '#008080',
    '#e6beff',
    '#9a6324',
    '#fffac8',
    '#800000',
    '#aaffc3',
    '#808000',
    '#ffd8b1',
    '#000075',
    '#808080',
    '#ffffff',
    '#000000',
  ];
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
  units = [
    { name: 'icampff', unit: '' },
    { name: 'dissolvedOxygen', unit: 'mg/L' },
    { name: 'nitrate', unit: 'µg/L' },
    { name: 'totalSuspendedSolids', unit: 'mg/L' },
    { name: 'thermotolerantColiforms', unit: 'NMP/100ml' },
    { name: 'pH', unit: '' },
    { name: 'chrolophyllA', unit: 'µg/L' },
    { name: 'biochemicalOxygenDemand', unit: 'mg/L' },
    { name: 'phosphates', unit: 'µg/L' },
  ];

  constructor(private apiService: ApiService, private datePipe: DatePipe) {}

  ngOnInit() {
    this.getElements();
  }

  configureChart() {
    const series = [];
    const legendNames = [];
    const units = [];
    const commonSeriesConfig = {
      type: 'line',
      smooth: true,
      itemStyle: {
        borderColor: 'rgba(0,0,0,0.4)',
        borderWidth: 1,
      },
      lineStyle: {
        normal: {
          width: 3,
          shadowColor: 'rgba(0,0,0,0.4)',
          shadowBlur: 10,
          shadowOffsetY: 10,
        },
      },
    };
    for (const axis of this.yAxisList) {
      if (!axis.active) {
        continue;
      }
      for (const activeSensor of axis.activeSensors) {
        const name = `${axis.name}, ${
          axis.sensors.find(s => s.name === activeSensor).title
        }`;
        if (axis instanceof WQMonitoringPointAxis) {
          const cache: any = {};
          for (const datum of axis.data) {
            cache[datum.date] = datum[activeSensor];
          }
          series.push({
            ...commonSeriesConfig,
            name,
            data: this.icampffDates.map((date: number) =>
              cache[date] !== undefined ? cache[date] : -1,
            ),
          });
        } else {
          series.push({
            ...commonSeriesConfig,
            name,
            data: axis.data.map(d => d[activeSensor]),
          });
        }
        legendNames.push(name);
        const unit = this.units.find(u => u.name === activeSensor);
        units.push(unit !== undefined ? unit.unit : '');
      }
    }
    this.options = {
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            title: 'Guardar',
            name: `grafico`,
          },
        },
      },
      backgroundColor: '#fafafa',
      color: this.colors,
      tooltip: {
        trigger: 'axis',
        formatter: (
          params: EChartOption.Tooltip.Format[],
          ticket,
          callback,
        ) => {
          return params
            .sort(
              (
                a: EChartOption.Tooltip.Format,
                b: EChartOption.Tooltip.Format,
              ) => (b.value as number) - (a.value as number),
            )
            .map(param => {
              const unit = units[param.seriesIndex];
              return `${param.seriesName}<br/>
            ${this.datePipe.transform(
              param.name,
              'shortDate',
            )}: <span style="color: ${
                param.color
              };">${(param.value as number).toFixed(2)}${
                unit !== undefined ? unit : ''
              }</span>`;
            })
            .join('<br/>');
        },
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
            formatter: (date: number) =>
              this.datePipe.transform(date, 'shortDate'),
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: (value: string | number | Date, index: any) => {
              switch (typeof value) {
                case 'number':
                  return value.toFixed(2);
                default:
                  return value;
              }
            },
          },
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
        },
      ],
      dataZoom: [
        {
          type: 'inside',
          throttle: 50,
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
              new WQMonitoringPointAxis(
                wq.id,
                wq.name,
                'Punto de monitoreo de calidad del agua',
                false,
                false,
                [],
              ),
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
                'Cuerpo de agua',
                true,
                true,
                this.icampffDates.map((date: number) => ({
                  icampff: this.icampffs[wb.id][date],
                })),
              ),
            );
          });
          this.configureChart();
        },
      });
  }
}
