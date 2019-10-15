import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperuserStartPageComponent } from './components/superuser-start-page/superuser-start-page.component';

const components = [SuperuserStartPageComponent];

@NgModule({
  declarations: components,
  imports: [CommonModule],
  exports: components,
})
export class SuperUserModule {}
