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
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnonymousUserStartPageComponent } from './components/anonymous-user-start-page/anonymous-user-start-page.component';
import { AquappComponent } from './components/aquapp/aquapp.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { RouterModule } from '@angular/router';

const components = [
  LoginComponent,
  AnonymousUserStartPageComponent,
  AquappComponent,
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
  ],
  exports: components,
  providers: [DatePipe],
})
export class AnonymousUserModule {}
