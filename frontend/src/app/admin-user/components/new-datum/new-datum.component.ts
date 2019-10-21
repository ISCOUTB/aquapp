import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/utils/services/api.service';
import { FormToolsService } from 'src/app/utils/services/form-tools.service';
import { ActivatedRoute } from '@angular/router';
import { TrackedObject } from 'src/app/utils/models/tracked-object';
import { Form } from 'src/app/utils/models/form';
import { Field } from 'src/app/utils/models/field';

@Component({
  selector: 'app-new-datum',
  templateUrl: './new-datum.component.html',
  styleUrls: ['./new-datum.component.scss'],
})
export class NewDatumComponent implements OnInit {
  form: FormGroup;
  trackedObject: TrackedObject;
  fields: Field[] = [];
  constructor(
    private apiService: ApiService,
    private formTools: FormToolsService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
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
          console.log(this.trackedObject);
          this.fields = (this.trackedObject.form as Form).fields;
          this.form = this.formTools.serializeFormFromTemplate(this.fields);
          this.fields = this.fields.filter(
            field =>
              this.trackedObject.trackedProperties.indexOf(field.name) > -1,
          );
        },
      });
  }
}
