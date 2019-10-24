import { Component, ChangeDetectorRef } from '@angular/core';
import { MessagesService, Message } from './utils/services/messages.service';
import { Subscription } from 'rxjs';
import { MESSAGES } from './messages';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = '';
  messageServiceSubscription: Subscription;
  routerEventsSubscription: Subscription;
  constructor(
    private messageService: MessagesService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}
}
