import {
  Component,
  OnInit,
  ViewContainerRef,
  ViewChild,
  AfterViewInit,
  TemplateRef,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/utils/services/api.service';
import { debounceTime } from 'rxjs/operators';
import { MyErrorStateMatcher } from 'src/app/utils/services/form-tools.service';
import { MessagesService } from 'src/app/utils/services/messages.service';
import { MESSAGES } from 'src/app/messages';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements AfterViewInit {
  form: FormGroup;
  incorrectCredentials = false;
  errorStateMatcher = new MyErrorStateMatcher();
  overlayRef: OverlayRef;
  @ViewChild('templatePortalContent', { static: false })
  templatePortalContent: TemplateRef<any>;
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private messageService: MessagesService,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.form.valueChanges.pipe(debounceTime(200)).subscribe(() => {
      this.incorrectCredentials = false;
    });
    this.messageService.sendMessage({ name: MESSAGES.hideToolbar, value: '' });
  }

  ngAfterViewInit() {
    this.overlayRef = this.overlay.create({
      width: 300,
      height: 320,
      disposeOnNavigation: true,
      positionStrategy: this.overlay
        .position()
        .global()
        .centerVertically()
        .centerHorizontally(),
    });
    this.overlayRef.attach(
      new TemplatePortal(this.templatePortalContent, this.viewContainerRef),
    );
  }

  login() {
    this.apiService
      .login(this.form.get('email').value, this.form.get('password').value)
      .then(
        () => {},
        () => {
          window.alert('Credenciales incorrectas');
        },
      );
  }
}
