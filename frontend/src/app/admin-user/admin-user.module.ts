import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminStartPageComponent } from './components/admin-start-page/admin-start-page.component';
import { UtilsModule } from '../utils/utils.module';
import { NewTrackedObjectComponent } from './components/new-tracked-object/new-tracked-object.component';
import { TrackedObjectsComponent } from './components/tracked-objects/tracked-objects.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatSelectModule,
  MatCheckboxModule,
  MatDialogModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MAT_DIALOG_DATA,
} from '@angular/material';
import { FormsComponent } from './components/forms/forms.component';
import { NewFormComponent } from './components/new-form/new-form.component';
import { DataComponent } from './components/data/data.component';
import { NewDatumComponent } from './components/new-datum/new-datum.component';
import { RolesComponent } from './components/roles/roles.component';
import { NewRoleComponent } from './components/new-role/new-role.component';
import { NewConditionComponent } from './components/new-condition/new-condition.component';
import { ConditionsComponent } from './components/conditions/conditions.component';

const components = [
  AdminStartPageComponent,
  NewTrackedObjectComponent,
  TrackedObjectsComponent,
  FormsComponent,
  NewFormComponent,
  DataComponent,
  NewDatumComponent,
  RolesComponent,
  NewRoleComponent,
  ConditionsComponent,
  NewConditionComponent,
];

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    UtilsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDialogModule,
  ],
  exports: components,
  entryComponents: [NewConditionComponent],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
    { provide: MAT_DIALOG_DATA, useValue: {} },
  ],
})
export class AdminUserModule {}
