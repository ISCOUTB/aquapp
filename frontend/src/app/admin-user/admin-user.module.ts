import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminStartPageComponent } from './components/admin-start-page/admin-start-page.component';
import { UtilsModule } from '../utils/utils.module';

const components = [AdminStartPageComponent];

@NgModule({
  declarations: components,
  imports: [CommonModule, UtilsModule],
  exports: components,
})
export class AdminUserModule {}
