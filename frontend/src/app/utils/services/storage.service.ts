import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  prefix = environment.production ? 'aquapp_prod' : 'aquapp_dev';
  constructor() {}

  save(name: string, value: string) {
    localStorage.setItem(this.prefix + name, value);
  }

  obtener(name: string): string {
    return localStorage.getItem(this.prefix + name);
  }

  borrar(name: string) {
    localStorage.removeItem(this.prefix + name);
  }
}
