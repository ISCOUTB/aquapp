import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DrawerElement } from '../../models/drawer';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { Location } from '@angular/common';
import { ROUTES } from 'src/app/routes';

@Component({
  selector: 'app-one-column-layout',
  templateUrl: './one-column-layout.component.html',
  styleUrls: ['./one-column-layout.component.scss'],
})
export class OneColumnLayoutComponent implements OnInit, OnDestroy {
  @Input() title: string;
  @Input() sidenavMode = 'over';
  elements: DrawerElement[] = [];
  drawerOpened = false;
  contentClass = 'content';
  resizeListener = () =>
    (this.contentClass = window.innerWidth < 600 ? 'content-2' : 'content');
  constructor(
    private router: Router,
    private storageService: StorageService,
    public location: Location,
  ) {
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnInit() {
    try {
      const user = JSON.parse(this.storageService.get('user'));
      console.log(user);
      this.elements.push({
        title: 'Inicio',
        icon: 'home',
        url: ['/', ROUTES.getStartPage],
        queryParameters: {},
      });
      if (user.name === 'superuser') {
        this.elements.push({
          title: 'Cerrar sesión',
          icon: 'input',
          url: ['/', ROUTES.login],
          queryParameters: {},
        });
      } else {
        this.elements.push({
          title: 'Cerrar sesión',
          icon: 'input',
          url: ['/', ROUTES.login],
          queryParameters: {},
        });
      }
    } catch (error) {
      this.elements.push({
        title: 'Iniciar sesión',
        icon: 'input',
        url: ['/', ROUTES.login],
        queryParameters: {},
      });
    }
  }

  elementPressed(element: DrawerElement) {
    this.router.navigate(element.url, {
      queryParams: element.queryParameters,
    });
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeListener);
  }
}
