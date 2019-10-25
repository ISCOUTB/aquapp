import { Injectable } from '@angular/core';
import { MarkerLayer, GeoJSONLayer, Layer } from '../models/layer';
import { Map } from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor() {}

  addLayer(layer: Layer, map: Map) {
    if (layer instanceof MarkerLayer) {
      for (const marker of layer.markers) {
        marker.addTo(map);
      }
    } else if (layer instanceof GeoJSONLayer) {
      layer.figures.addTo(map);
    }
    layer.active = true;
    layer.loaded = true;
  }

  removeLayer(layer: Layer, map: Map) {
    if (layer instanceof MarkerLayer) {
      for (const marker of layer.markers) {
        marker.removeFrom(map);
      }
    } else if (layer instanceof GeoJSONLayer) {
      layer.figures.removeFrom(map);
    }
    layer.active = false;
    layer.loaded = false;
  }
}
