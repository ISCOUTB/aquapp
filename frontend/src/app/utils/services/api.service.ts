import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router,
  ) {}

  // AUTHENTICATION

  logOut() {
    this.storageService.borrar('user');
    this.storageService.borrar('token');
    this.storageService.borrar('user');
    this.router.navigate(['/', 'login']);
  }

  async login(email: string, password: string) {
    if (email && password) {
      this.storageService.save('user', email);
    }
    const r = await this.http
      .post<{ token: string }>(
        this.apiUrl + '/usuarios/login',
        { email, password },
        {
          headers: {
            Authorization: 'Basic ' + btoa(email + ':' + password),
          },
        },
      )
      .toPromise()
      .catch(() => {
        window.alert('Credenciales incorrectas');
        return null;
      });
    if (r !== null) {
      this.storageService.save('token', r.token);
      const user: any = await this.me().toPromise();
      this.storageService.save('user', JSON.stringify(user));
      this.redirectToStartPage();
    }
  }

  redirectToStartPage() {
    this.router.navigateByUrl('/paginas/get-start-page');
  }

  authenticatedUser(): any {
    return JSON.parse(this.storageService.obtener('user'));
  }

  me() {
    return this.http.get(`${this.apiUrl}/usuarios/me`, {
      headers: this.getHeaders(),
    });
  }

  // CRUD
  get(endpoint: string, parameters: { [prop: string]: string | string[] }) {
    return this.http.get<any>(`${this.apiUrl}/${endpoint}`, {
      params: parameters,
      headers: this.getHeaders(),
    });
  }

  getBuffer(
    endpoint: string,
    parametros: { [prop: string]: string | string[] },
  ) {
    const opciones: any = {
      params: parametros,
      responseType: 'blob',
      headers: this.getHeaders(),
    };
    return this.http.get(`${this.apiUrl}/${endpoint}`, { ...opciones });
  }

  post(
    endpoint: string,
    parametros: { [prop: string]: string | string[] },
    cuerpo: any,
  ) {
    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, cuerpo, {
      params: parametros,
      headers: this.getHeaders(),
    });
  }

  delete(endpoint: string, parametros: { [prop: string]: string | string[] }) {
    return this.http.delete<any>(`${this.apiUrl}/${endpoint}`, {
      params: parametros,
      headers: this.getHeaders(),
    });
  }

  patch(
    endpoint: string,
    parametros: { [prop: string]: string | string[] },
    cuerpo: any,
  ) {
    return this.http.patch<any>(`${this.apiUrl}/${endpoint}`, cuerpo, {
      params: parametros,
      headers: this.getHeaders(),
    });
  }

  getHeaders() {
    return {
      'content-type': 'application/json',
      Authorization: 'Bearer ' + this.storageService.obtener('token'),
    };
  }
}
