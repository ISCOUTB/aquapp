import { Component, OnInit } from '@angular/core';
import { MessagesService } from 'src/app/utils/services/messages.service';
import { MESSAGES } from 'src/app/messages';
import { tileLayer, latLng, LatLngBounds, Map, Marker, DivIcon } from 'leaflet';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/utils/services/api.service';
import { JSONataResponse } from 'src/app/utils/models/url';
import { MarkerClusterLayer, Layer, MarkerLayer } from 'src/app/utils/models/layer';
import { MapService } from 'src/app/utils/services/map.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogDateTimeComponent } from '../dialog-date-time/dialog-date-time.component';
declare let L;
import 'leaflet';
import 'leaflet.markercluster';
import { NoopScrollStrategy } from '@angular/cdk/overlay';


@Component({
  selector: 'app-sensor-app',
  templateUrl: './sensor-app.component.html',
  styleUrls: [ './sensor-app.component.scss' ],
})
export class SensorAppComponent implements OnInit {
  mapStyle: any = {
    height: `${window.innerHeight - 64}px`,
    width: '100%',
  };
  mapOptions = {
    layers: [
      tileLayer(environment.mapUrl, {
        maxZoom: 18,
        attribution: 'Map data © OpenStreetMap contributors',
      }),
    ],
    zoom: 13.5,
    center: latLng(10.4241961, -75.535),
  };
  mapBounds = new LatLngBounds(latLng(10.371076, -75.466699), latLng(10.369281, -75.463776));
  map: Map;
  form = '5dc341823153fa33d0225b11';
  routes: any[];
  layers: Layer[] = [];
  constructor(
    private messageService: MessagesService,
    private apiService: ApiService,
    private mapService: MapService,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.messageService.sendMessage({ name: MESSAGES.closeSidenav, value: {} });
    this.messageService.sendMessage({
      name: MESSAGES.fullWidthContent,
      value: {},
    });
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
    }
    this.setupLayers();
  }

  setupLayers() {
    console.log(this.layers);
    const markerStyle = `
            text-shadow: 2px 0 0 #333,
              -2px 0 0 #333, 0 2px 0 #333,
              0 -2px 0 #333, 1px 1px #333,
              -1px -1px 0 #333,
              1px -1px 0 #333,
              -1px 1px 0 #333;
            color: #3f51b5;
            font-size: 32pt;
          `;
    for (const route of this.routes) {
      //console.log(route.data);
      console.log((route.data || []).map(d => d.latitude !== null && d.latitude !== undefined &&
        d.longitude !== null && d.longitude !== undefined ? [d.latitude, d.longitude] : []));
    for (const route of this.routes) {
      this.layers.push(
        new MarkerLayer(
          'Posiciones',
          '',
          {},
          true,
          false,
          (route.data || []).map((d) => d.latitude !== null && d.latitude !== undefined &&
            d.longitude !== null && d.longitude !== undefined ? new Marker([d.latitude, d.longitude],
              {
                icon: new DivIcon({
                  className: 'marker',
                  html: `
                <i
                  class="fas fa-map-marker-alt"
                  style="${markerStyle}"
                >
                </i>
                `,
                  iconSize: [32, 32],
                  iconAnchor: [12, 36],
                }),
              },
            ) : new Marker([0, 0])),
          (route.data || []).map((d) => new Marker([ d.latitude, d.longitude ])),
        ),
      );
    }
    this.updateLayers();
  }

  updateLayers() {
    for (const layer of this.layers) {
      if (layer.active && !layer.loaded) {
        this.mapService.addLayer(layer, this.map);
      } else if (!layer.active && layer.loaded) {
        this.mapService.removeLayer(layer, this.map);
      }
    }
  }

  onMapReady(map: Map) {
    this.map = map;
    window.addEventListener('resize', () => this.fixMap());
    setTimeout(() => {
      this.init();
      this.fixMap();
      /*this.messageService.sendMessage({
        name: MESSAGES.showSplashScreen,
        value: {},
      });*/
    }, 300);
  }

  fixMap() {
    this.mapStyle =
      this.mapStyle === undefined
        ? {
            height: `${window.innerHeight - 64}px`,
            width: '100%',
          }
        : this.mapStyle;
    this.map.invalidateSize();
    if (this.mapBounds) {
      this.map.fitBounds(this.mapBounds);
    }
  }

  openDialogDateTime() {
    const dialogRef = this.dialog.open(DialogDateTimeComponent, {
      data: {
        Date: new Date(), StartTime: '', EndTime: ''
      },
      scrollStrategy: new NoopScrollStrategy()
        Date: new Date(),
        StartTime: '',
        EndTime: '',
      },
      scrollStrategy: new NoopScrollStrategy(),
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        const newStartDate = new Date(
          result.Date.getFullYear(),
          result.Date.getMonth(),
          result.Date.getDate(),
          parseInt(result.StartTime, 10),
          0,
          0,
          0,
        );
        const newEndDate = new Date(
          result.Date.getFullYear(),
          result.Date.getMonth(),
          result.Date.getDate(),
          parseInt(result.EndTime, 10),
          0,
          0,
          0,
        );
        for (const route of this.routes) {
          route.data = await this.apiService
            .get('/data/open/vm2', {
              query: `this.data`,
              additionalFilters: JSON.stringify([
                { trackedObject: route.id },
                { createdAt: { gte: +newStartDate } },
                { createdAt: { lte: +newEndDate } },
              ]),
            })
            .toPromise();
        }
        for (const layer of this.layers) {
          layer.active = false;
        }
        console.log(this.routes);
        this.updateLayers();
        this.layers = [];
        this.setupLayers();
      }
    });

  }
}
