import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminStartPageComponent } from './components/admin-start-page/admin-start-page.component';
import { UtilsModule } from '../utils/utils.module';
import { NewTrackedObjectComponent } from './components/new-tracked-object/new-tracked-object.component';
import { TrackedObjectsComponent } from './components/tracked-objects/tracked-objects.component';

const components = [
  AdminStartPageComponent,
  NewTrackedObjectComponent,
  TrackedObjectsComponent,
];

@NgModule({
  declarations: components,
  imports: [CommonModule, UtilsModule],
  exports: components,
})
export class AdminUserModule {}
