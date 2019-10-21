import { Injectable } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null,
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class FormToolsService {
  constructor(private fb: FormBuilder) {}

  deserialize(form: FormGroup, partial = true) {
    const object = {};
    for (const field of Object.keys(form.controls)) {
      object[field] =
        form.get(field) && (partial ? form.get(field).pristine : false)
          ? undefined
          : form.get(field).value;
    }
    return object;
  }

  serializeFromObject(form: FormGroup, object: any) {
    for (const property of Object.keys(object)) {
      const field = form.get(property);
      if (field !== null) {
        field.setValue(object[property]);
      }
    }
  }

  getControlsFromTemplate(fields: any) {
    const controls = {};
    // Convertir cada field en un control para el formulario
    for (const fieldTemplate of fields) {
      controls[fieldTemplate.name] = fieldTemplate.required
        ? [fieldTemplate.defaultValue, Validators.required]
        : [fieldTemplate.defaultValue];
    }
    return controls;
  }

  serializeFormFromTemplate(fields: any) {
    const form = this.fb.group(this.getControlsFromTemplate(fields));
    // Establecer los valores por defecto
    for (const fieldTemplate of fields) {
      const formField = form.get(fieldTemplate.name);
      if (formField !== null) {
        formField.setValue(
          !!fieldTemplate.defaultValue
            ? fieldTemplate.defaultValue
            : fieldTemplate.defaultValue,
        );
        if (fieldTemplate.soloLectura) {
          formField.disable();
        }
      }
    }
    return form;
  }

  setValuesToObject(object: any, form: FormGroup) {
    for (const field of Object.keys(form.controls)) {
      object[field] =
        form.get(field) === null ? undefined : form.get(field).value;
    }
  }

  getFormFieldTemplate(fieldType: string) {
    let form: FormGroup;
    const commonControls = {
      required: [false, Validators.required],
      readOnly: [false, Validators.required],
      hidden: [false, Validators.required],
      name: ['', Validators.required],
      title: ['', Validators.required],
      description: [''],
    };
    switch (fieldType) {
      case 'short-text':
        form = this.fb.group({
          ...commonControls,
          defaultValue: ['', Validators.required],
        });
        break;
      case 'number':
        form = this.fb.group({
          ...commonControls,
          defaultValue: [0, Validators.required],
        });
        break;
      case 'tracked-object':
        form = this.fb.group({
          ...commonControls,
          defaultValue: [0, Validators.required],
          form: ['', Validators.required],
          multi: [false, Validators.required],
          populate: [false, Validators.required],
        });
        break;
      case 'date':
        form = this.fb.group({
          ...commonControls,
          defaultValue: [Date.now(), Validators.required],
        });
        break;
      default:
        form = this.fb.group({
          ...commonControls,
          defaultValue: ['', Validators.required],
        });
        break;
    }
    return form;
  }
}
