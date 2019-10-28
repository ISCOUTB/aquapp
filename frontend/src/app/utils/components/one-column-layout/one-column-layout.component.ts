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
  fullWidthContent = false;
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
        this.fullWidthContent = false;
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
          case MESSAGES.closeSidenav:
            this.drawerOpened = false;
            break;
          case MESSAGES.fullWidthContent:
            this.fullWidthContent = true;
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
            title: 'aquapp.sidenav.superuser.start',
            icon: 'home',
            url: ['/', ROUTES.superuser],
            queryParameters: {},
          },
          {
            title: 'aquapp.sidenav.superuser.logout',
            icon: 'input',
            url: ['/', ROUTES.login],
            queryParameters: {},
          },
        );
      } else {
        this.elements.push(
          {
            title: 'aquapp.sidenav.admin.start',
            icon: 'home',
            url: ['/', ROUTES.admin],
            queryParameters: {},
          },
          {
            title: 'aquapp.sidenav.admin.objects',
            icon: 'account_tree',
            url: ['/', ROUTES.trackedObjects],
            queryParameters: {},
          },
          {
            title: 'aquapp.sidenav.admin.forms',
            icon: 'assignment',
            url: ['/', ROUTES.forms],
            queryParameters: {},
          },
          {
            title: 'aquapp.sidenav.admin.roles',
            icon: 'verified_user',
            url: ['/', ROUTES.roles],
            queryParameters: {},
          },
          {
            title: 'aquapp.sidenav.admin.users',
            icon: 'people',
            url: ['/', ROUTES.users],
            queryParameters: {},
          },
          {
            title: 'aquapp.sidenav.admin.logout',
            icon: 'input',
            url: ['/', ROUTES.login],
            queryParameters: {},
          },
        );
      }
    } catch (error) {
      this.elements.push(
        {
          title: 'aquapp.sidenav.anonymousUser.start',
          icon: 'home',
          url: ['/', ROUTES.start],
          queryParameters: {},
        },
        {
          title: 'aquapp.sidenav.anonymousUser.about',
          icon: 'info',
          url: ['/', ROUTES.about],
          queryParameters: {},
        },
        {
          title: 'aquapp.sidenav.anonymousUser.exportData',
          icon: 'bar_chart',
          url: ['/', ROUTES.aquappExportData],
          queryParameters: {},
        },
        {
          title: 'aquapp.sidenav.anonymousUser.login',
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
