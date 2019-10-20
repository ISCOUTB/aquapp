import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TrackedObjectField } from '../../models/field';
import { ApiService } from '../../services/api.service';
import { JSONataResponse } from '../../models/url';

@Component({
  selector: 'app-tracked-object-field',
  templateUrl: './tracked-object-field.component.html',
  styleUrls: ['./tracked-object-field.component.scss'],
})
export class TrackedObjectFieldComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() template: TrackedObjectField;
  trackedObjects: any[] = [];
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    const currentValue: any = this.form.get(this.template.name).value;
    console.log(currentValue);
    this.form
      .get(this.template.name)
      .setValue(
        typeof currentValue === 'string'
          ? currentValue.split('')
          : currentValue,
      );

    this.form
      .get(this.template.name)
      .valueChanges.subscribe((val: any) => console.log(val));
    this.apiService
      .get('/elements/jsonata', {
        query: '([$])',
        additionalFilters: JSON.stringify([
          { category: 'tracked-objects', form: this.template.form },
        ]),
      })
      .subscribe({
        next: (response: JSONataResponse) =>
          (this.trackedObjects = response.data),
      });
  }
}
