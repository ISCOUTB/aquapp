import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TextField } from '../../models/field';

@Component({
  selector: 'app-date-field',
  templateUrl: './date-field.component.html',
  styleUrls: ['./date-field.component.scss'],
})
export class DateFieldComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() template: TextField;
  controlForm: FormGroup;
  startDate = new Date();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    const controls: any = {};
    controls[this.template.name] = this.template.required
      ? ['', Validators.required]
      : [''];
    this.controlForm = this.formBuilder.group(controls);
    this.controlForm
      .get(this.template.name)
      .valueChanges.subscribe((value: any) => {
        this.form.get(this.template.name).setValue(new Date(value).getTime());
      });
    this.form.get(this.template.name).valueChanges.subscribe({
      next: (value: number) => {
        this.controlForm
          .get(this.template.name)
          .setValue(new Date(value).toISOString(), { emitEvent: false });
      },
    });
  }
}
