import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperuserStartPageComponent } from './components/superuser-start-page/superuser-start-page.component';
import { UtilsModule } from '../utils/utils.module';

const components = [SuperuserStartPageComponent];

@NgModule({
  declarations: components,
  imports: [CommonModule, UtilsModule],
  exports: components,
})
export class SuperUserModule {}
