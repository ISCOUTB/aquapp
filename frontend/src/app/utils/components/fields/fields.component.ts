import { Component, OnInit, Input } from '@angular/core';
import { Field } from '../../models/field';
import { FormGroup } from '@angular/forms';
import { AddFieldComponent } from '../add-field/add-field.component';
import { MatDialog } from '@angular/material';
import { FormToolsService } from '../../services/form-tools.service';

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss'],
})
export class FieldsComponent implements OnInit {
  @Input() form: FormGroup;
  fields: Field[] = [];

  constructor(public dialog: MatDialog, private formTools: FormToolsService) {}

  ngOnInit() {
    this.form
      .get('fields')
      .valueChanges.subscribe((value: any[]) => (this.fields = value));
  }

  addField() {
    const dialogRef = this.dialog.open(AddFieldComponent, {
      width: '250px',
      hasBackdrop: true,
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
      width: '250px',
      data: this.fields[index],
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
