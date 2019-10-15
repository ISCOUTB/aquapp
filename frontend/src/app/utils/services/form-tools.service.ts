import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormToolsService {
  constructor(private fb: FormBuilder) {}

  deserialize(form: FormGroup, partial = true) {
    const object = {};
    for (const campo of Object.keys(form.controls)) {
      object[campo] =
        form.get(campo) && (partial ? form.get(campo).pristine : false)
          ? undefined
          : form.get(campo).value;
    }
    return object;
  }

  serializeFromObject(form: FormGroup, object: any) {
    for (const propiedad of Object.keys(object)) {
      const campo = form.get(propiedad);
      if (campo !== null) {
        campo.setValue(object[propiedad]);
      }
    }
  }

  getControlsFromTemplate(fields: any) {
    const controls = {};
    // Convertir cada campo en un control para el formulario
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
      const campoFormulario = form.get(fieldTemplate.name);
      if (campoFormulario !== null) {
        campoFormulario.setValue(
          !!fieldTemplate.defaultValue
            ? fieldTemplate.defaultValue
            : fieldTemplate.defaultValue,
        );
        if (fieldTemplate.soloLectura) {
          campoFormulario.disable();
        }
      }
    }
    return form;
  }

  setValuesFromObject(object: any, form: FormGroup) {
    for (const campo of Object.keys(form.controls)) {
      object[campo] =
        form.get(campo) === null ? undefined : form.get(campo).value;
    }
  }

  getFormFieldTemplate(fieldType: string) {
    let form: FormGroup;
    switch (fieldType) {
      case 'short-text':
        form = this.fb.group({
          type: ['', Validators.required],
          name: ['', Validators.required],
          title: ['', Validators.required],
          description: [''],
          defaultValue: ['', Validators.required],
        });
        break;
      case 'number':
        form = this.fb.group({
          type: ['', Validators.required],
          name: ['', Validators.required],
          title: ['', Validators.required],
          description: [''],
          defaultValue: [0, Validators.required],
        });
        break;
      default:
        form = this.fb.group({
          type: ['', Validators.required],
          name: ['', Validators.required],
          title: ['', Validators.required],
          description: [''],
          defaultValue: ['', Validators.required],
        });
        break;
    }
    form.get('type').setValue(fieldType);
    return form;
  }
}
