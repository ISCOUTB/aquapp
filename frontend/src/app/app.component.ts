import {
  Component,
  ViewChild,
  TemplateRef,
  OnDestroy,
  ViewContainerRef,
} from '@angular/core';
import { MessagesService, Message } from './utils/services/messages.service';
import { Subscription } from 'rxjs';
import { MESSAGES } from './messages';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  title = '';
  messageServiceSubscription: Subscription;
  overlayRef: OverlayRef;

  @ViewChild('splashScreen', { static: false })
  splashScreen: TemplateRef<any>;
  constructor(
    private messageService: MessagesService,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
  ) {
    this.messageServiceSubscription = this.messageService
      .getMessage()
      .subscribe((message: Message) => {
        switch (message.name) {
          case MESSAGES.showSplashScreen:
            this.openSplashScreen();
            break;
          case MESSAGES.hideSplashScreen:
            this.closeOverlay();
            break;
          default:
            break;
        }
      });
    this.overlayRef = this.overlay.create({
      width: 0,
      height: 0,
      hasBackdrop: true,
      disposeOnNavigation: true,
      positionStrategy: this.overlay
        .position()
        .global()
        .centerVertically()
        .centerHorizontally(),
    });
  }

  openSplashScreen() {
    this.overlayRef.updateSize({
      width: 100,
      height: 100,
    });
    this.overlayRef.attach(
      new TemplatePortal(this.splashScreen, this.viewContainerRef),
    );
  }

  closeOverlay() {
    this.overlayRef.updateSize({ width: 0, height: 0 });
    this.overlayRef.detach();
  }

  ngOnDestroy() {
    this.messageServiceSubscription.unsubscribe();
    this.overlayRef.detach();
    this.overlayRef.dispose();
  }
}
