import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/utils/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { FormToolsService } from 'src/app/utils/services/form-tools.service';
import { Location } from '@angular/common';
import { Form } from 'src/app/utils/models/form';
import { JSONataResponse } from 'src/app/utils/models/url';
import { Field } from 'src/app/utils/models/field';

@Component({
  selector: 'app-new-tracked-object',
  templateUrl: './new-tracked-object.component.html',
  styleUrls: ['./new-tracked-object.component.scss'],
})
export class NewTrackedObjectComponent implements OnInit {
  title = 'Nuevo objeto';
  form: FormGroup;
  additionalFieldsForm: FormGroup;
  additionalFields: Field[] = [];
  id: string;
  loading = false;
  forms: Form[] = [];
  previousValue: any;
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
      form: ['', Validators.required],
    });
    this.form.get('category').setValue('tracked-objects');
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.queryParams.id;
    if (!!this.id) {
      this.loading = true;
      this.form.disable();
      this.apiService.get(`/elements/${this.id}`, {}).subscribe({
        next: trackedObject => {
          this.previousValue = trackedObject;
          this.formTools.serializeFromObject(this.form, trackedObject);
          this.form.enable();
          this.form.updateValueAndValidity();
        },
        error: () => {},
        complete: () => (this.loading = false),
      });
    }
    this.apiService
      .get('/elements/jsonata', {
        query: '([$])',
        additionalFilters: JSON.stringify([{ category: 'forms' }]),
      })
      .subscribe({
        next: (forms: JSONataResponse) => {
          this.forms = forms.data as Form[];
          this.form
            .get('form')
            .valueChanges.subscribe((value: string) =>
              this.updateAdditionalFieldsForm(value),
            );
          if (!!this.form.get('form').value) {
            this.updateAdditionalFieldsForm(this.form.get('form').value);
            this.formTools.serializeFromObject(
              this.additionalFieldsForm,
              this.previousValue,
            );
          }
        },
      });
  }

  updateAdditionalFieldsForm(template: string) {
    this.previousValue = {
      ...this.previousValue,
      ...this.form.value,
      ...(this.additionalFieldsForm !== undefined
        ? this.additionalFieldsForm.value
        : {}),
    };
    this.additionalFieldsForm = this.formTools.getFormFieldTemplate(template);
    this.additionalFields = this.forms.find(
      form => form.id === template,
    ).fields;
    this.additionalFieldsForm = this.formTools.serializeFormFromTemplate(
      this.additionalFields,
    );
  }

  newTrackedObject() {
    this.loading = true;
    this.apiService
      .post(
        '/elements',
        {},
        { ...this.form.value, ...this.additionalFieldsForm.value },
      )
      .subscribe({
        next: () => {
          this.location.back();
        },
        error: () => {},
        complete: () => (this.loading = false),
      });
  }

  editTrackedObject() {
    this.loading = true;
    this.apiService
      .patch(
        `/elements/${this.id}`,
        {},
        { ...this.form.value, ...this.additionalFieldsForm.value },
      )
      .subscribe({
        next: () => {
          this.location.back();
        },
        error: () => {},
        complete: () => (this.loading = false),
      });
  }
}
