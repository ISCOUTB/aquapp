import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddFieldComponent } from 'src/app/utils/components/add-field/add-field.component';
import { Condition } from '../conditions/conditions.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormToolsService } from 'src/app/utils/services/form-tools.service';
import { Field } from 'src/app/utils/models/field';
import { FIELD_TYPES } from 'src/app/utils/models/field';

@Component({
  selector: 'app-new-condition',
  templateUrl: './new-condition.component.html',
  styleUrls: ['./new-condition.component.scss'],
})
export class NewConditionComponent implements OnInit {
  @Input() condition: Condition;
  @Input() operators: { name: string; title: string }[] = [];
  form: FormGroup;
  fields: Field[] = [];
  acceptedFieldTypes = ['short-text', 'number'];
  fieldTypes = FIELD_TYPES.filter(
    ft => this.acceptedFieldTypes.indexOf(ft.name) > -1,
  );
  constructor(
    public dialogRef: MatDialogRef<AddFieldComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private formTools: FormToolsService,
  ) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      property: ['', Validators.required],
      operator: ['', Validators.required],
      value: ['', Validators.required],
      valueType: ['', Validators.required],
    });
  }

  onNoClick(cancel = false): void {
    if (cancel) {
      this.dialogRef.close();
      return;
    }
    this.dialogRef.close(this.form.value);
  }

  ngOnInit() {
    this.operators = this.data.operators;
    this.condition = this.data.condition;
    if (this.condition !== undefined) {
      this.formTools.serializeFromObject(this.form, this.condition);
    }
  }
}
