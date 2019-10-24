import { Component, OnInit } from '@angular/core';
import { FormGroup, Form, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/utils/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { FormToolsService } from 'src/app/utils/services/form-tools.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-new-role',
  templateUrl: './new-role.component.html',
  styleUrls: ['./new-role.component.scss'],
})
export class NewRoleComponent implements OnInit {
  title = 'Nuevo rol';
  form: FormGroup;
  id: string;
  loading = false;
  forms: Form[] = [];
  previousValue: any;
  collections = [
    { name: 'elements', title: 'Elementos' },
    { name: 'data', title: 'Datos' },
  ];
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    public location: Location,
    private formTools: FormToolsService,
  ) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      collection: ['', Validators.required],
      category: ['', Validators.required],
      conditions: [[]],
      create: [false, Validators.required],
      read: [false, Validators.required],
      update: [false, Validators.required],
      delete: [false, Validators.required],
    });
    this.form.get('category').setValue('roles');
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.queryParams.id;
    if (!!this.id) {
      this.title = 'Editar rol';
      this.loading = true;
      this.form.disable();
      this.apiService.get(`/elements/${this.id}`, {}).subscribe({
        next: role => {
          this.formTools.serializeFromObject(this.form, role);
          this.form.enable();
          this.form.updateValueAndValidity();
        },
        error: () => {},
        complete: () => (this.loading = false),
      });
    }
  }

  newRole() {
    this.loading = true;
    this.apiService.post('/elements', {}, this.form.value).subscribe({
      next: () => {
        this.location.back();
      },
      error: () => {},
      complete: () => (this.loading = false),
    });
  }

  editRole() {
    this.loading = true;
    this.apiService
      .patch(`/elements/${this.id}`, {}, this.form.value)
      .subscribe({
        next: () => {
          this.location.back();
        },
        error: () => {},
        complete: () => (this.loading = false),
      });
  }
}
