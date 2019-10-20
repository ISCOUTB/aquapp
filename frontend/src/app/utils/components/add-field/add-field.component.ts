import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormToolsService } from '../../services/form-tools.service';

@Component({
  selector: 'app-add-field',
  templateUrl: './add-field.component.html',
  styleUrls: ['./add-field.component.scss'],
})
export class AddFieldComponent implements OnInit {
  fieldTypes = [
    {
      name: 'short-text',
      title: 'Texto',
      validators: [],
    },
    {
      name: 'number',
      title: 'Número',
      validators: [
        {
          name: 'latitude',
          title: 'Latitud',
        },
        {
          name: 'longitude',
          title: 'Longitud',
        },
      ],
    },
  ];
  validators = [];
  controlForm: FormGroup;
  fieldForm: FormGroup;
  editing = false;
  title = 'Nuevo campo';
  constructor(
    public dialogRef: MatDialogRef<AddFieldComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private formTools: FormToolsService,
  ) {
    this.controlForm = this.formBuilder.group({
      type: ['', Validators.required],
      validators: [[]],
    });
  }

  onNoClick(): void {
    if (this.controlForm.valid && this.fieldForm.valid) {
      this.dialogRef.close({
        ...this.controlForm.value,
        ...this.fieldForm.value,
      });
      return;
    }
    this.dialogRef.close();
  }

  ngOnInit() {
    if (Object.keys(this.data).length) {
      this.editing = true;
      this.title = 'Editando campo';
      this.formTools.serializeFromObject(this.controlForm, this.data);
      this.fieldForm = this.formTools.getFormFieldTemplate(
        this.controlForm.get('type').value,
      );
      this.formTools.serializeFromObject(this.fieldForm, this.data);
    }
    this.controlForm.get('type').valueChanges.subscribe({
      next: (value: string) => {
        this.fieldForm = this.formTools.getFormFieldTemplate(value);
        this.validators = this.fieldTypes.find(
          field => field.name === value,
        ).validators;
      },
    });
  }
}
