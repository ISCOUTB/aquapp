import { Component, OnInit } from '@angular/core';
import { MessagesService } from 'src/app/utils/services/messages.service';
import { MESSAGES } from 'src/app/messages';
import { tileLayer, latLng, LatLngBounds, Map } from 'leaflet';
import { environment } from 'src/environments/environment';

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
  constructor(private messageService: MessagesService) {}

  ngOnInit() {
    this.messageService.sendMessage({ name: MESSAGES.closeSidenav, value: {} });
    this.messageService.sendMessage({
      name: MESSAGES.fullWidthContent,
      value: {},
    });
  }

  onMapReady(map: Map) {
    this.map = map;
    window.addEventListener('resize', () => this.fixMap());
    setTimeout(() => {
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
