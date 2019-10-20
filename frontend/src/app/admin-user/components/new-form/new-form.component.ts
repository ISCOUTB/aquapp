import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/utils/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { FormToolsService } from 'src/app/utils/services/form-tools.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-new-form',
  templateUrl: './new-form.component.html',
  styleUrls: ['./new-form.component.scss'],
})
export class NewFormComponent implements OnInit {
  title = 'Nuevo formulario';
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
      description: [''],
      category: ['', Validators.required],
      fields: [[], Validators.required],
    });
    this.form.get('category').setValue('forms');
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.queryParams.id;
    if (!!this.id) {
      this.loading = true;
      this.form.disable();
      this.apiService.get(`/elements/${this.id}`, {}).subscribe({
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

  newForm() {
    this.loading = true;
    this.apiService.post('/elements', {}, this.form.value).subscribe({
      next: () => {
        this.location.back();
      },
      error: () => {},
      complete: () => (this.loading = false),
    });
  }

  editForm() {
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
