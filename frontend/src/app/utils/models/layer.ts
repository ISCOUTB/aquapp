import {
  Marker,
  LatLngBounds,
  latLng,
  FeatureGroup,
  MarkerClusterGroup,
  markerClusterGroup,
  DivIcon,
  LatLng,
} from 'leaflet';
declare let L;
import 'leaflet';
import 'leaflet.markercluster';

export interface Layer {
  name: string;
  description: string;
  object: any;
  active: boolean;
  loaded: boolean;
  getBounds: () => LatLngBounds;
}

export class MarkerLayer implements Layer {
  constructor(
    public name: string,
    public description: string,
    public object: any,
    public active: boolean,
    public loaded: boolean,
    public markers: Marker[],
  ) {}

  getBounds() {
    const bounds = new LatLngBounds(
      latLng(10.400885, -75.554942),
      latLng(10.452121, -75.505814),
    );
    for (const marker of this.markers) {
      bounds.extend(marker.getLatLng());
    }
    return bounds;
  }
}

export class MarkerClusterLayer implements Layer {
  public markers: Marker[] = [];
  cluster: MarkerClusterGroup;
  constructor(
    public name: string,
    public description: string,
    public object: any,
    public active: boolean,
    public loaded: boolean,
    public latLngs: number[][],
  ) {
    this.cluster = markerClusterGroup({
      iconCreateFunction: function(sCluster) {
        const color =
          sCluster.getChildCount() > 40
            ? '#ff3d71'
            : sCluster.getChildCount() > 30
            ? '#ffaa00'
            : sCluster.getChildCount() > 20
            ? '#00d68f'
            : sCluster.getChildCount() > 10
            ? '#0095ff'
            : '#3366ff';
        const estiloContenedor = `
        text-shadow: 2px 0 0 #333,
          -2px 0 0 #333, 0 2px 0 #333,
          0 -2px 0 #333, 1px 1px #333,
          -1px -1px 0 #333,
          1px -1px 0 #333,
          -1px 1px 0 #333;
        color: white;
        font-size: 32px;
        background: ${color};
        border: 2px solid #666;
        border-radius: 50%;
        display:inline-block;
        line-height:0px;
      `;
        const estiloTexto = `
        display:inline-block;
        padding-top:50%;
        padding-bottom:50%;
        margin-left:8px;
        margin-right:8px;
        color: #ddd;
      `;
        return L.divIcon({
          html: `
        <span style="${estiloContenedor}">
          <span style="${estiloTexto}">${sCluster.getChildCount()}</span>
        </span>
        `,
          className: 'badge',
        });
      },
    });
    for (const latLngi of latLngs) {
      const marker = new Marker([latLngi[0], latLngi[1]]);
      this.cluster.addLayer(marker);
      this.markers.push(marker);
    }
  }

  getBounds() {
    const bounds = new LatLngBounds(
      latLng(10.400885, -75.554942),
      latLng(10.452121, -75.505814),
    );
    for (const marker of this.markers) {
      bounds.extend(marker.getLatLng());
    }
    return bounds;
  }
}

export class GeoJSONLayer implements Layer {
  constructor(
    public name: string,
    public description: string,
    public object: any,
    public active: boolean,
    public loaded: boolean,
    public figures: FeatureGroup,
  ) {}

  getBounds() {
    return this.figures.getBounds();
  }
}
