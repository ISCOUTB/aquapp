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
  MatDatepickerModule,
  MatNativeDateModule,
} from '@angular/material';
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
import { DateFieldComponent } from './components/date-field/date-field.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { FileFieldComponent } from './components/file-field/file-field.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
  DateFieldComponent,
  FileUploadComponent,
  FileFieldComponent,
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
    MatDatepickerModule,
    MatNativeDateModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    ApiService,
    StorageService,
    MessagesService,
    MatDatepickerModule,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
    { provide: MAT_DIALOG_DATA, useValue: {} },
  ],
  exports: components,
  entryComponents: [AddFieldComponent],
})
export class UtilsModule {}
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
