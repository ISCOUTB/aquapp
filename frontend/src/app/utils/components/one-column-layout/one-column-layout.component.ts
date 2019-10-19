import { Component, OnInit, Input } from '@angular/core';
import { DrawerElement } from '../../models/drawer';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-one-column-layout',
  templateUrl: './one-column-layout.component.html',
  styleUrls: ['./one-column-layout.component.scss'],
})
export class OneColumnLayoutComponent implements OnInit {
  @Input() title: string;
  @Input() sidenavMode = 'over';
  elements: DrawerElement[] = [];
  drawerOpened = false;
  constructor(
    private router: Router,
    private storageService: StorageService,
    public location: Location,
  ) {}

  ngOnInit() {
    try {
      const user = JSON.parse(this.storageService.get('user'));
      console.log(user);
      if (user.name === 'superuser') {
        this.elements.push({
          title: 'Cerrar sesión',
          icon: 'input',
          url: ['/', 'login'],
          queryParameters: {},
        });
      } else {
        this.elements.push({
          title: 'Cerrar sesión',
          icon: 'input',
          url: ['/', 'login'],
          queryParameters: {},
        });
      }
    } catch (error) {
      this.elements.push({
        title: 'Iniciar sesión',
        icon: 'input',
        url: ['/', 'login'],
        queryParameters: {},
      });
    }
  }

  elementPressed(element: DrawerElement) {
    this.router.navigate(element.url, {
      queryParams: element.queryParameters,
    });
  }
}
