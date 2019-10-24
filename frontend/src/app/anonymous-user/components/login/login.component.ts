import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/utils/services/api.service';
import { debounceTime } from 'rxjs/operators';
import { MyErrorStateMatcher } from 'src/app/utils/services/form-tools.service';
import { MessagesService } from 'src/app/utils/services/messages.service';
import { MESSAGES } from 'src/app/messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  incorrectCredentials = false;
  errorStateMatcher = new MyErrorStateMatcher();
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private messageService: MessagesService,
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

  ngOnInit() {}

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
