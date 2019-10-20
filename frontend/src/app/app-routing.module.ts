import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './anonymous-user/components/login/login.component';
import { GetStartPageComponent } from './utils/components/get-start-page/get-start-page.component';
import { SuperuserStartPageComponent } from './super-user/components/superuser-start-page/superuser-start-page.component';
import { AdminStartPageComponent } from './admin-user/components/admin-start-page/admin-start-page.component';
import { AnonymousUserStartPageComponent } from './anonymous-user/components/anonymous-user-start-page/anonymous-user-start-page.component';
import { AdminsComponent } from './super-user/components/admins/admins.component';
import { NewAdminComponent } from './super-user/components/new-admin/new-admin.component';
import { ROUTES } from './routes';
import { TrackedObjectsComponent } from './admin-user/components/tracked-objects/tracked-objects.component';
import { NewTrackedObjectComponent } from './admin-user/components/new-tracked-object/new-tracked-object.component';
import { FormsComponent } from './admin-user/components/forms/forms.component';
import { NewFormComponent } from './admin-user/components/new-form/new-form.component';

const routes: Routes = [
  // Anonymous user routes
  { path: ROUTES.login, component: LoginComponent },
  // Superuser routes
  { path: ROUTES.superuser, component: SuperuserStartPageComponent },
  { path: ROUTES.admins, component: AdminsComponent },
  { path: ROUTES.newAdmin, component: NewAdminComponent },
  // Admin routes
  { path: ROUTES.admin, component: AdminStartPageComponent },
  { path: ROUTES.trackedObjects, component: TrackedObjectsComponent },
  { path: ROUTES.newTrackedObject, component: NewTrackedObjectComponent },
  { path: ROUTES.forms, component: FormsComponent },
  { path: ROUTES.newForm, component: NewFormComponent },
  {
    path: ROUTES.start,
    component: AnonymousUserStartPageComponent,
  },
  {
    path: '**',
    component: GetStartPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
