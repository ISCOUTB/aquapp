import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Field } from '../../models/field';

@Component({
  selector: 'app-render-fields',
  templateUrl: './render-fields.component.html',
  styleUrls: ['./render-fields.component.scss'],
})
export class RenderFieldsComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() fields: Field[] = [];
  constructor() {}

  ngOnInit() {}
}
