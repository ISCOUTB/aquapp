import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperuserStartPageComponent } from './components/superuser-start-page/superuser-start-page.component';
import { UtilsModule } from '../utils/utils.module';
import { AdminsComponent } from './components/admins/admins.component';
import { NewAdminComponent } from './components/new-admin/new-admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatInputModule,
  MatButtonModule,
  MatIconModule,
} from '@angular/material';

const components = [
  SuperuserStartPageComponent,
  AdminsComponent,
  NewAdminComponent,
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
  ],
  exports: components,
})
export class SuperUserModule {}
