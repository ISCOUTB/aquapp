import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { UtilsModule } from '../utils/utils.module';
import {
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatListModule,
  MatIconModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatSelectModule,
  MatGridListModule,
  MatDialogModule, 
  MatFormFieldModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSliderModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnonymousUserStartPageComponent } from './components/anonymous-user-start-page/anonymous-user-start-page.component';
import { AquappComponent } from './components/aquapp/aquapp.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { RouterModule } from '@angular/router';
import { AquappExportDataComponent } from './components/aquapp-export-data/aquapp-export-data.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { AquappAboutComponent } from './components/aquapp-about/aquapp-about.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { SensorAppComponent } from './components/sensor-app/sensor-app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogDateTimeComponent } from './components/dialog-date-time/dialog-date-time.component';




@NgModule({
  declarations: [
    LoginComponent,
    AnonymousUserStartPageComponent,
    AquappComponent,
    AquappExportDataComponent,
    AquappAboutComponent,
    SensorAppComponent,
    DialogDateTimeComponent
  ],
  imports: [
    CommonModule,
    UtilsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    LeafletModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatCheckboxModule,
    NgxEchartsModule,
    MatExpansionModule,
    MatSelectModule,
    MatGridListModule,
    MatDialogModule, 
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  entryComponents: [
    DialogDateTimeComponent
  ],
  exports: [],
  providers: [DatePipe],
})
export class AnonymousUserModule {}
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
