import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DrawerElement } from '../../models/drawer';
import { Router, NavigationStart } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { Location } from '@angular/common';
import { ROUTES } from 'src/app/routes';
import { Subscription } from 'rxjs';
import { MessagesService, Message } from '../../services/messages.service';
import { MESSAGES } from 'src/app/messages';

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
  sidenavHidden = false;
  messageServiceSubscription: Subscription;
  routerEventsSubscription: Subscription;
  activeRoute: number;
  constructor(
    private router: Router,
    private storageService: StorageService,
    public location: Location,
    private messageService: MessagesService,
  ) {
    if (window.innerWidth >= 700) {
      this.drawerOpened = true;
    }
    this.resizeListener();
    window.addEventListener('resize', () => this.resizeListener());
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.activeRoute = (this.elements || []).findIndex(element =>
          element.url.join('').includes(event.url),
        );
        this.sidenavHidden = false;
        if (window.innerWidth >= 700) {
          this.drawerOpened = true;
        }
      }
    });
    this.messageServiceSubscription = this.messageService
      .getMessage()
      .subscribe((message: Message) => {
        switch (message.name) {
          case MESSAGES.hideToolbar:
            this.sidenavHidden = true;
            break;
          case MESSAGES.logout:
          case MESSAGES.login:
            this.configureMenu();
            break;
          default:
            break;
        }
      });
  }

  resizeListener() {
    this.sidenavMode = window.innerWidth < 700 ? 'over' : 'side';
  }

  ngOnInit() {
    this.configureMenu();
  }

  configureMenu() {
    this.elements = [];
    try {
      const user = JSON.parse(this.storageService.get('user'));
      if (user.name === 'superuser') {
        this.elements.push(
          {
            title: 'Inicio',
            icon: 'home',
            url: ['/', ROUTES.superuser],
            queryParameters: {},
          },
          {
            title: 'Cerrar sesión',
            icon: 'input',
            url: ['/', ROUTES.login],
            queryParameters: {},
          },
        );
      } else {
        this.elements.push(
          {
            title: 'Inicio',
            icon: 'home',
            url: ['/', ROUTES.admin],
            queryParameters: {},
          },
          {
            title: 'Objetos',
            icon: 'account_tree',
            url: ['/', ROUTES.trackedObjects],
            queryParameters: {},
          },
          {
            title: 'Formularios',
            icon: 'assignment',
            url: ['/', ROUTES.forms],
            queryParameters: {},
          },
          {
            title: 'Roles',
            icon: 'verified_user',
            url: ['/', ROUTES.roles],
            queryParameters: {},
          },
          {
            title: 'Usuarios',
            icon: 'people',
            url: ['/', ROUTES.users],
            queryParameters: {},
          },
          {
            title: 'Cerrar sesión',
            icon: 'input',
            url: ['/', ROUTES.login],
            queryParameters: {},
          },
        );
      }
    } catch (error) {
      this.elements.push(
        {
          title: 'Inicio',
          icon: 'home',
          url: ['/', ROUTES.start],
          queryParameters: {},
        },
        {
          title: 'Iniciar sesión',
          icon: 'input',
          url: ['/', ROUTES.login],
          queryParameters: {},
        },
      );
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
