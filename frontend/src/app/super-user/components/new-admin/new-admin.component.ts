import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/utils/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormToolsService } from 'src/app/utils/services/form-tools.service';

@Component({
  selector: 'app-new-admin',
  templateUrl: './new-admin.component.html',
  styleUrls: ['./new-admin.component.scss'],
})
export class NewAdminComponent implements OnInit {
  title = 'Nuevo usuario administrador';
  form: FormGroup;
  id: string;
  loading = false;
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
    });
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.queryParams.id;
    if (!!this.id) {
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
    this.apiService.patch(`/users/${this.id}`, {}, this.form.value).subscribe({
      next: () => {
        this.location.back();
      },
      error: () => {},
      complete: () => (this.loading = false),
    });
  }
}
