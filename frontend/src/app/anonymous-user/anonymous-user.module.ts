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
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnonymousUserStartPageComponent } from './components/anonymous-user-start-page/anonymous-user-start-page.component';
import { AquappComponent } from './components/aquapp/aquapp.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { RouterModule } from '@angular/router';
import { AquappExportDataComponent } from './components/aquapp-export-data/aquapp-export-data.component';
import { NgxEchartsModule } from 'ngx-echarts';

const components = [
  LoginComponent,
  AnonymousUserStartPageComponent,
  AquappComponent,
  AquappExportDataComponent,
];

@NgModule({
  declarations: components,
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
  ],
  exports: components,
  providers: [DatePipe],
})
export class AnonymousUserModule {}
