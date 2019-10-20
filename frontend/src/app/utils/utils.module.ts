import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './services/api.service';
import { StorageService } from './services/storage.service';
import { MessagesService } from './services/messages.service';
import { TableComponent } from './components/table/table.component';
import {
  MatTableModule,
  MatButtonModule,
  MatPaginatorModule,
  MatSortModule,
  MatProgressSpinnerModule,
  MatToolbarModule,
  MatCardModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatGridListModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatInputModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatCheckboxModule,
} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { ParticlesBackgroundComponent } from './components/particles-background/particles-background.component';
import { GetStartPageComponent } from './components/get-start-page/get-start-page.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { OneColumnLayoutComponent } from './components/one-column-layout/one-column-layout.component';
import { LinkGridComponent } from './components/link-grid/link-grid.component';
import { RouterModule } from '@angular/router';
import { FieldsComponent } from './components/fields/fields.component';
import { AddFieldComponent } from './components/add-field/add-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RenderFieldsComponent } from './components/render-fields/render-fields.component';
import { TextFieldComponent } from './components/text-field/text-field.component';
import { NumberFieldComponent } from './components/number-field/number-field.component';
import { TrackedObjectFieldComponent } from './components/tracked-object-field/tracked-object-field.component';

const components = [
  TableComponent,
  ParticlesBackgroundComponent,
  GetStartPageComponent,
  ToolbarComponent,
  OneColumnLayoutComponent,
  LinkGridComponent,
  FieldsComponent,
  AddFieldComponent,
  RenderFieldsComponent,
  TextFieldComponent,
  NumberFieldComponent,
  TrackedObjectFieldComponent,
];

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatToolbarModule,
    MatCardModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    RouterModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  providers: [
    ApiService,
    StorageService,
    MessagesService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
    { provide: MAT_DIALOG_DATA, useValue: {} },
  ],
  exports: components,
  entryComponents: [AddFieldComponent],
})
export class UtilsModule {}
