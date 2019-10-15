import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { UtilsModule } from '../utils/utils.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, UtilsModule],
})
export class AnonymousUserModule {}
