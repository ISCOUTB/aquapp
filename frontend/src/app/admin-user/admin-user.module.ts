import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminStartPageComponent } from './components/admin-start-page/admin-start-page.component';

const components = [AdminStartPageComponent];

@NgModule({
  declarations: components,
  imports: [CommonModule],
  exports: components,
})
export class AdminUserModule {}
