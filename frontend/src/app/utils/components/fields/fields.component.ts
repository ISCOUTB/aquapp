import { Component, OnInit, Input } from '@angular/core';
import { Field } from '../../models/field';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss'],
})
export class FieldsComponent implements OnInit {
  @Input() form: FormGroup;
  fields: Field[] = [];

  constructor() {}

  ngOnInit() {
    this.form
      .get('fields')
      .valueChanges.subscribe((value: any[]) => (this.fields = value));
  }

  addField() {}

  editField(index: number) {}

  removeField(index: number) {}
}
