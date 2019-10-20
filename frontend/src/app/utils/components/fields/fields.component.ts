import { Component, OnInit, Input } from '@angular/core';
import { Field } from '../../models/field';
import { FormGroup } from '@angular/forms';
import { AddFieldComponent } from '../add-field/add-field.component';
import { MatDialog } from '@angular/material';
import { FormToolsService } from '../../services/form-tools.service';
import { ApiService } from '../../services/api.service';
import { Form } from '../../models/form';
import { JSONataResponse } from '../../models/url';

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss'],
})
export class FieldsComponent implements OnInit {
  @Input() form: FormGroup;
  fields: Field[] = [];
  forms: Form[] = [];
  constructor(
    public dialog: MatDialog,
    private formTools: FormToolsService,
    private apiService: ApiService,
  ) {}

  ngOnInit() {
    this.form
      .get('fields')
      .valueChanges.subscribe((value: any[]) => (this.fields = value));

    this.apiService
      .get('/elements/jsonata', {
        query: '([$])',
        additionalFilters: JSON.stringify([{ category: 'forms' }]),
      })
      .subscribe({
        next: (forms: JSONataResponse) => {
          this.forms = forms.data as Form[];
        },
      });
  }

  addField() {
    const dialogRef = this.dialog.open(AddFieldComponent, {
      width: '80%',
      maxWidth: '350px',
      maxHeight: '600px',
      height: '80%',
      hasBackdrop: true,
      data: { forms: this.forms },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.fields.push(result);
        this.form.get('fields').setValue(this.fields);
      }
    });
  }

  editField(index: number) {
    const dialogRef = this.dialog.open(AddFieldComponent, {
      width: '80%',
      maxWidth: '350px',
      maxHeight: '600px',
      height: '80%',
      data: { field: this.fields[index], forms: this.forms },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.fields[index] = result;
      this.form.get('fields').setValue(this.fields);
    });
  }

  removeField(index: number) {
    if (!window.confirm('¿Está seguro de elminar el campo?')) {
      return;
    }
    this.fields.splice(index, 1);
    this.form.get('fields').setValue(this.fields);
  }
}
