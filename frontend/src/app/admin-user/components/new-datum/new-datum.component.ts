import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/utils/services/api.service';
import { FormToolsService } from 'src/app/utils/services/form-tools.service';
import { ActivatedRoute } from '@angular/router';
import { TrackedObject } from 'src/app/utils/models/tracked-object';
import { Form } from 'src/app/utils/models/form';
import { Field } from 'src/app/utils/models/field';
import { Location } from '@angular/common';
import { MessagesService } from 'src/app/utils/services/messages.service';
import { MESSAGES } from 'src/app/messages';

@Component({
  selector: 'app-new-datum',
  templateUrl: './new-datum.component.html',
  styleUrls: ['./new-datum.component.scss'],
})
export class NewDatumComponent implements OnInit {
  form: FormGroup;
  trackedObject: TrackedObject;
  fields: Field[] = [];
  loading = false;
  id: string;
  title = 'Nuevo dato';
  constructor(
    private apiService: ApiService,
    private formTools: FormToolsService,
    private activatedRoute: ActivatedRoute,
    public location: Location,
    private messages: MessagesService,
  ) {}

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.queryParams.id;
    this.apiService
      .get(
        `/elements/${this.activatedRoute.snapshot.queryParams.trackedObjectId}`,
        {
          populate: 'true',
        },
      )
      .subscribe({
        next: (trackedObject: TrackedObject) => {
          this.trackedObject = trackedObject;
          this.fields = (this.trackedObject.form as Form).fields;
          this.form = this.formTools.serializeFormFromTemplate(this.fields);
          this.fields = this.fields.filter(
            field =>
              this.trackedObject.trackedProperties.indexOf(field.name) > -1,
          );
          this.getDatum();
        },
      });
  }

  getDatum() {
    if (!!this.id) {
      this.title = 'Editar dato';
      this.apiService.get(`/data/${this.id}`, {}).subscribe({
        next: (datum: any) => {
          this.formTools.serializeFromObject(this.form, datum);
        },
      });
    }
  }

  newDatum() {
    this.loading = true;
    this.apiService
      .post(
        '/data',
        {},
        { ...this.form.value, trackedObject: this.trackedObject.id },
      )
      .subscribe({
        next: () => {
          this.location.back();
        },
        error: () => {},
        complete: () => (this.loading = false),
      });
  }

  editDatum() {
    this.loading = true;
    this.apiService.patch(`/data/${this.id}`, {}, this.form.value).subscribe({
      next: () => {
        this.location.back();
      },
      error: () => {},
      complete: () => (this.loading = false),
    });
  }
}
