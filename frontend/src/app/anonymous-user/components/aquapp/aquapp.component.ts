import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  ViewContainerRef,
  NgZone,
  OnDestroy,
} from '@angular/core';
import { MessagesService } from 'src/app/utils/services/messages.service';
import { MESSAGES } from 'src/app/messages';
import { Map, tileLayer, latLng, LatLngBounds, Marker, DivIcon } from 'leaflet';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/utils/services/api.service';
import { Layer, MarkerLayer } from 'src/app/utils/models/layer';
import { JSONataResponse, QueryParameters } from 'src/app/utils/models/url';
import { MapService } from 'src/app/utils/services/map.service';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-aquapp',
  templateUrl: './aquapp.component.html',
  styleUrls: ['./aquapp.component.scss'],
})
export class AquappComponent implements OnInit, AfterViewInit, OnDestroy {
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
    latLng(10.400885, -75.554942),
    latLng(10.452121, -75.505814),
  );
  map: Map;
  monitoringPointsId = '5dacb798a52adb394573ca70';
  layers: Layer[] = [];
  overlayRef: OverlayRef;

  @ViewChild('templatePortalContent', { static: false })
  templatePortalContent: TemplateRef<any>;
  overlayTitle: string;
  overlayDescription: string;
  overlayRouterLink = ['/'];
  overlayQueryParams: QueryParameters = {};

  constructor(
    private messageService: MessagesService,
    private apiService: ApiService,
    private mapService: MapService,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private ngZone: NgZone,
  ) {}

  ngOnInit() {
    this.messageService.sendMessage({ name: MESSAGES.closeSidenav, value: {} });
    this.messageService.sendMessage({
      name: MESSAGES.fullWidthContent,
      value: {},
    });
  }

  ngAfterViewInit() {
    this.overlayRef = this.overlay.create({
      width: 300,
      height: 320,
      disposeOnNavigation: true,
      hasBackdrop: true,
      positionStrategy: this.overlay
        .position()
        .global()
        .centerVertically()
        .centerHorizontally(),
    });
  }

  ngOnDestroy() {
    this.overlayRef.dispose();
  }

  openOverlay(data: any) {
    this.overlayTitle = data.name;
    this.overlayDescription = data.description;
    this.overlayRouterLink = ['/', 'login'];
    this.overlayQueryParams = {};
    this.overlayRef.attach(
      new TemplatePortal(this.templatePortalContent, this.viewContainerRef),
    );
  }

  closeOverlay() {
    console.log('Removing overlay');
    this.overlayRef.detach();
  }

  setupLayers() {
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
          console.log(response);
          const markers: Marker[] = [];
          const markerStyle = `
            text-shadow: 2px 0 0 #333,
              -2px 0 0 #333, 0 2px 0 #333,
              0 -2px 0 #333, 1px 1px #333,
              -1px -1px 0 #333,
              1px -1px 0 #333,
              -1px 1px 0 #333;
            color: black;
            font-size: 32pt;
          `;
          for (const monitoringPoint of response.data) {
            markers.push(
              new Marker(
                [monitoringPoint.latitude, monitoringPoint.longitude],
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
              ).on('click', () =>
                this.ngZone.run(() => this.openOverlay(monitoringPoint)),
              ),
            );
          }
          this.layers.push(
            new MarkerLayer(
              'Puntos de monitoreo CA',
              'Registran mediciones de parámetros\
             físico-químicos para el cálculo de \
             la calidad del agua.',
              {},
              true,
              false,
              markers,
            ),
          );
        })
        .catch(),
    );
    Promise.all(promises).then(() => {
      for (const layer of this.layers) {
        this.mapBounds.extend(layer.getBounds());
      }
      console.log(this.mapBounds);
      console.log(this.layers);
      this.updateLayers();
    });
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
      this.fixMap();
      this.setupLayers();
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

  layerMenu() {}
}
