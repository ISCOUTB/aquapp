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

  get(name: string): string {
    return localStorage.getItem(this.prefix + name);
  }

  delete(name: string) {
    localStorage.removeItem(this.prefix + name);
  }
}
