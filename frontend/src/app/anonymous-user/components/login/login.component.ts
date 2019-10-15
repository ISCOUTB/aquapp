import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/utils/services/api.service';
import { debounceTime } from 'rxjs/operators';
import { MyErrorStateMatcher } from 'src/app/utils/services/form-tools.service';

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
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.form.valueChanges.pipe(debounceTime(200)).subscribe(() => {
      this.incorrectCredentials = false;
    });
  }

  ngOnInit() {}

  login() {
    this.apiService
      .login(this.form.get('email').value, this.form.get('password').value)
      .then(
        (response: any) => {
          console.log(response);
        },
        () => {
          window.alert('Credenciales incorrectas');
        },
      );
  }
}
