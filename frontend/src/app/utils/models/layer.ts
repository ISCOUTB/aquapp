import { Marker, LatLngBounds, latLng, FeatureGroup } from 'leaflet';

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
