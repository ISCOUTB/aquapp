import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/utils/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { FormToolsService } from 'src/app/utils/services/form-tools.service';
import { Location } from '@angular/common';
import { JSONataResponse } from 'src/app/utils/models/url';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss'],
})
export class NewUserComponent implements OnInit {
  title = 'Nuevo usuario';
  id: string;
  loading = false;
  form: FormGroup;
  roles: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    public location: Location,
    private formTools: FormToolsService,
  ) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      roles: [[], [Validators.required]],
    });
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.queryParams.id;
    if (!!this.id) {
      this.form.get('password').setValidators(null);
      this.form.get('password').updateValueAndValidity();
      this.title = 'Editando usuario';
      this.loading = true;
      this.form.disable();
      this.apiService.get(`/users/${this.id}`, {}).subscribe({
        next: user => {
          this.formTools.serializeFromObject(this.form, user);
          this.form.enable();
          this.form.updateValueAndValidity();
        },
        error: () => {},
        complete: () => (this.loading = false),
      });
    }
    this.apiService
      .get(`/elements/jsonata`, {
        query: `([$])`,
        additionalFilters: JSON.stringify([{ category: 'roles' }]),
      })
      .subscribe({
        next: (response: JSONataResponse) => {
          this.roles = response.data;
        },
        error: () => {},
      });
  }

  newAdmin() {
    this.loading = true;
    this.apiService.post('/users', {}, this.form.value).subscribe({
      next: () => {
        this.location.back();
      },
      error: () => {},
      complete: () => (this.loading = false),
    });
  }

  editAdmin() {
    this.loading = true;
    this.apiService
      .patch(`/users/${this.id}`, {}, this.formTools.deserialize(this.form))
      .subscribe({
        next: () => {
          this.location.back();
        },
        error: () => {},
        complete: () => (this.loading = false),
      });
  }
}
