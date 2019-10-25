import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FileField } from '../../models/field';

@Component({
  selector: 'app-file-field',
  templateUrl: './file-field.component.html',
  styleUrls: ['./file-field.component.scss'],
})
export class FileFieldComponent implements OnInit {
  icon = 'cloud_upload';
  @Input() form: FormGroup;
  @Input() template: FileField;
  constructor() {}

  ngOnInit() {}
}
