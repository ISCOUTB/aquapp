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
import {
  MessagesService,
  Message,
} from 'src/app/utils/services/messages.service';
import { MESSAGES } from 'src/app/messages';
import {
  Map,
  tileLayer,
  latLng,
  LatLngBounds,
  Marker,
  DivIcon,
  FeatureGroup,
  geoJSON,
  GeoJSON,
} from 'leaflet';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/utils/services/api.service';
import { Layer, MarkerLayer, GeoJSONLayer } from 'src/app/utils/models/layer';
import { JSONataResponse, QueryParameters } from 'src/app/utils/models/url';
import { MapService } from 'src/app/utils/services/map.service';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { DatePipe } from '@angular/common';
import { ROUTES } from 'src/app/routes';

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

  @ViewChild('icampffDatesContent', { static: false })
  icampffDatesMenuRef: TemplateRef<any>;

  @ViewChild('layersMenuContent', { static: false })
  layersMenuRef: TemplateRef<any>;

  overlayTitle: string;
  overlayDescription: string;
  overlayRouterLink = ['/'];
  overlayParagraphs = [];
  overlayQueryParams: QueryParameters = {};

  waterBodies: any[];
  idToWaterBodyGeoJSON: { [prop: string]: GeoJSON<any> } = {};
  // ID -> DATE -> ICAMpffAvg
  icampffs: { [prop: string]: { [prop: number]: number } } = {};
  icampffDates: number[] = [];
  currentIcampffDate: number;

  constructor(
    private messageService: MessagesService,
    private apiService: ApiService,
    private mapService: MapService,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private ngZone: NgZone,
    private datePipe: DatePipe,
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
      width: 0,
      height: 0,
      hasBackdrop: true,
      disposeOnNavigation: true,
      positionStrategy: this.overlay
        .position()
        .global()
        .centerVertically()
        .centerHorizontally(),
    });
  }

  ngOnDestroy() {
    this.overlayRef.detach();
    this.overlayRef.dispose();
  }

  openOverlay(data: any) {
    this.overlayParagraphs = data.additionalParagraphs || [];
    this.overlayRef.updateSize({ width: 400, height: 400 });
    this.overlayTitle = data.name;
    this.overlayDescription = data.description;
    this.overlayRouterLink = ['/', ROUTES.aquappExportData];
    this.overlayQueryParams = { id: data.id };
    this.overlayRef.attach(
      new TemplatePortal(this.templatePortalContent, this.viewContainerRef),
    );
  }

  openIcampffDateOverlay() {
    this.overlayRef.updateSize({ width: 400, height: 400 });
    this.overlayRef.attach(
      new TemplatePortal(this.icampffDatesMenuRef, this.viewContainerRef),
    );
  }

  openLayerMenuOverlay() {
    this.overlayRef.updateSize({ width: 400, height: 400 });
    this.overlayRef.attach(
      new TemplatePortal(this.layersMenuRef, this.viewContainerRef),
    );
  }

  closeOverlay() {
    this.overlayRef.updateSize({ width: 0, height: 0 });
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
          const markers: Marker[] = [];
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
          const figures: FeatureGroup = new FeatureGroup();
          for (const waterBody of response.data) {
            if (!!waterBody.geojson) {
              const geojson: GeoJSON<any> = geoJSON(waterBody.geojson);
              geojson.on('click', () =>
                this.ngZone.run(() => {
                  const icampff = this.icampffs[waterBody.id][
                    this.currentIcampffDate
                  ];
                  this.openOverlay({
                    name: waterBody.name,
                    description: `\
                      ${waterBody.description}
                    `,
                    additionalParagraphs: [
                      `Fecha: ${this.datePipe.transform(
                        this.currentIcampffDate,
                        'shortDate',
                      )}.`,
                      `ICAMpff: ${
                        icampff === -1 || icampff === undefined
                          ? 'Información no disponible'
                          : icampff.toFixed(2)
                      }.`,
                    ],
                  });
                }),
              );
              this.idToWaterBodyGeoJSON[waterBody.id] = geojson;
              figures.addLayer(
                geoJSON(waterBody.geojson, {
                  style: {
                    color: '#ccc',
                    fillColor: '#ccc',
                    fillOpacity: 0.8,
                  },
                }),
              );
            }
          }
          this.waterBodies = response.data;
          this.layers.push(
            new GeoJSONLayer('ICAMpff', '', {}, true, false, figures),
          );
        })
        .catch(),
    );
    Promise.all(promises).then(() => {
      for (const layer of this.layers) {
        this.mapBounds.extend(layer.getBounds());
      }
      this.getIcampffs();
      this.updateLayers();
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
          for (const datum of data) {
            if (
              datum.date !== undefined &&
              this.icampffDates.indexOf(datum.date) === -1
            ) {
              this.icampffDates.push(datum.date);
            }
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
          this.setIcampffDate(this.icampffDates[this.icampffDates.length - 1]);
        },
        complete: () => {
          this.messageService.sendMessage({
            name: MESSAGES.hideSplashScreen,
            value: {},
          });
        },
      });
  }

  getColor(icampff: number) {
    return icampff > 90
      ? '#51B53F' // blue
      : icampff > 70
      ? '#8BB53F' // green
      : icampff > 50
      ? '#B5A33F' // yellow
      : icampff > 25
      ? '#B5683F' // orange
      : icampff === -1
      ? '#555555'
      : '#B53F51'; // red
  }

  setIcampffDate(date: number) {
    this.currentIcampffDate = date;
    const icampffLayer: GeoJSONLayer = this.layers.find(
      l => l.name === 'ICAMpff',
    ) as GeoJSONLayer;
    for (const waterBody of this.waterBodies) {
      const geojson: GeoJSON<any> = this.idToWaterBodyGeoJSON[waterBody.id];
      const color = this.getColor(this.icampffs[waterBody.id][date]);
      icampffLayer.figures.removeLayer(geojson);
      geojson.setStyle({
        color,
        fillColor: color,
        fillOpacity: 0.8,
      });
      icampffLayer.figures.addLayer(geojson);
    }
  }

  updateLayers() {
    for (const layer of this.layers) {
      if (layer.active && !layer.loaded) {
        this.mapService.addLayer(layer, this.map);
      } else if (!layer.active && layer.loaded) {
        this.mapService.removeLayer(layer, this.map);
      }
    }
    if (!!this.currentIcampffDate) {
      this.setIcampffDate(this.currentIcampffDate);
    }
  }

  onMapReady(map: Map) {
    this.map = map;
    window.addEventListener('resize', () => this.fixMap());
    setTimeout(() => {
      this.fixMap();
      this.messageService.sendMessage({
        name: MESSAGES.showSplashScreen,
        value: {},
      });
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
