import { Component, OnInit, Input } from '@angular/core';
import { DrawerElement } from '../../models/drawer';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-one-column-layout',
  templateUrl: './one-column-layout.component.html',
  styleUrls: ['./one-column-layout.component.scss'],
})
export class OneColumnLayoutComponent implements OnInit {
  @Input() title: string;
  @Input() sidenavMode = 'over';
  @Input() elements: DrawerElement[] = [];
  drawerOpened = false;
  constructor(private router: Router, private storageService: StorageService) {}

  ngOnInit() {
    try {
      const user = JSON.parse(this.storageService.get('user'));
      this.elements.push({
        title: 'Cerrar sesión',
        icon: 'input',
        url: ['/', 'login'],
        queryParameters: {},
      });
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
