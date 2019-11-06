import { Injectable } from '@angular/core';
import {
  MarkerLayer,
  GeoJSONLayer,
  Layer,
  MarkerClusterLayer,
} from '../models/layer';
import { Map } from 'leaflet';
import 'leaflet';
import 'leaflet.markercluster';

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
    } else if (layer instanceof MarkerClusterLayer) {
      map.addLayer(layer.cluster);
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
    } else if (layer instanceof MarkerClusterLayer) {
      layer.cluster.removeFrom(map);
    }
    layer.active = false;
    layer.loaded = false;
  }
}
