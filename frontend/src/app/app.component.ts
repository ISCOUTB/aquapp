import { Component } from '@angular/core';
import { MessagesService, Message } from './utils/services/messages.service';
import { Subscription } from 'rxjs';
import { MESSAGES } from './messages';
import {
  ActivatedRoute,
  Data,
  Router,
  NavigationStart,
  NavigationEnd,
} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = '';
  sidenav = true;
  subscription: Subscription;
  constructor(
    private messageService: MessagesService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.subscription = this.messageService
      .getMessage()
      .subscribe((message: Message) => {
        console.log(message);
        switch (message.name) {
          case MESSAGES.changePageTitle:
            this.title = message.value as string;
            break;
          default:
            break;
        }
      });
  }
}
