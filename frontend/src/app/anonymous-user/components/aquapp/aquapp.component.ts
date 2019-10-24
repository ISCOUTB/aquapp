import { Component, OnInit } from '@angular/core';
import { MessagesService } from 'src/app/utils/services/messages.service';
import { MESSAGES } from 'src/app/messages';
import { Map, tileLayer, latLng, LatLngBounds } from 'leaflet';

@Component({
  selector: 'app-aquapp',
  templateUrl: './aquapp.component.html',
  styleUrls: ['./aquapp.component.scss'],
})
export class AquappComponent implements OnInit {
  mapStyle: any = {
    height: `${window.innerHeight - 64}px`,
    width: '100%',
  };
  mapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data © OpenStreetMap contributors',
      }),
    ],
    zoom: 13.5,
    center: latLng(10.4241961, -75.535),
  };
  mapBounds: LatLngBounds;
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
    this.fixMap();
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
