import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TextField } from '../../models/field';

@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss'],
})
export class TextFieldComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() template: TextField;

  constructor() {}

  ngOnInit() {}
}
