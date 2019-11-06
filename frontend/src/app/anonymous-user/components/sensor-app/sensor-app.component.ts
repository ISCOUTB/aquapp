import { Component, OnInit } from '@angular/core';
import { MessagesService } from 'src/app/utils/services/messages.service';
import { MESSAGES } from 'src/app/messages';
import { tileLayer, latLng, LatLngBounds, Map } from 'leaflet';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/utils/services/api.service';
import { JSONataResponse } from 'src/app/utils/models/url';
import { MarkerClusterLayer, Layer } from 'src/app/utils/models/layer';
import { MapService } from 'src/app/utils/services/map.service';
declare let L;
import 'leaflet';
import 'leaflet.markercluster';

@Component({
  selector: 'app-sensor-app',
  templateUrl: './sensor-app.component.html',
  styleUrls: ['./sensor-app.component.scss'],
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
  mapBounds = new LatLngBounds(
    latLng(10.371076, -75.466699),
    latLng(10.369281, -75.463776),
  );
  map: Map;
  form = '5dc341823153fa33d0225b11';
  routes: any[];
  layers: Layer[] = [];
  constructor(
    private messageService: MessagesService,
    private apiService: ApiService,
    private mapService: MapService,
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
          additionalFilters: JSON.stringify([{ trackedObject: route.id }]),
        })
        .toPromise();
    }
    this.setupLayers();
  }

  setupLayers() {
    console.log(this.layers);
    for (const route of this.routes) {
      console.log((route.data || []).map(d => [d.latitude, d.longitude]));
      this.layers.push(
        new MarkerClusterLayer(
          'Posiciones',
          '',
          {},
          true,
          false,
          (route.data || []).map(d => [d.latitude, d.longitude]),
        ),
      );
    }
    console.log(this.layers);
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
}
