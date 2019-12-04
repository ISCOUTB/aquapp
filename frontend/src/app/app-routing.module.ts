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
import { DataComponent } from './admin-user/components/data/data.component';
import { NewDatumComponent } from './admin-user/components/new-datum/new-datum.component';
import { RolesComponent } from './admin-user/components/roles/roles.component';
import { NewRoleComponent } from './admin-user/components/new-role/new-role.component';
import { UsersComponent } from './admin-user/components/users/users.component';
import { NewUserComponent } from './admin-user/components/new-user/new-user.component';
import { AquappExportDataComponent } from './anonymous-user/components/aquapp-export-data/aquapp-export-data.component';
import { AquappAboutComponent } from './anonymous-user/components/aquapp-about/aquapp-about.component';
import { SensorAppComponent } from './anonymous-user/components/sensor-app/sensor-app.component';
import { AquappComponent } from './anonymous-user/components/aquapp/aquapp.component';
import { SensorAppExportDataComponent } from './anonymous-user/components/sensor-app-export-data/sensor-app-export-data.component';

const routes: Routes = [
  // Anonymous user routes
  { path: ROUTES.login, component: LoginComponent },
  // Anonymous user - AquApp
  { path: ROUTES.aquappExportData, component: AquappExportDataComponent },
  { path: ROUTES.about, component: AquappAboutComponent },
  { path: ROUTES.aquapp, component: AquappComponent },
  // Anonymous user - SensorApp
  { path: ROUTES.sensorApp, component: SensorAppComponent },
  { path: ROUTES.bar, component: SensorAppExportDataComponent },
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
  { path: ROUTES.data, component: DataComponent },
  { path: ROUTES.newDatum, component: NewDatumComponent },
  {
    path: ROUTES.start,
    component: AquappComponent,
  },
  {
    path: ROUTES.roles,
    component: RolesComponent,
  },
  {
    path: ROUTES.newRole,
    component: NewRoleComponent,
  },
  {
    path: ROUTES.users,
    component: UsersComponent,
  },
  {
    path: ROUTES.newUser,
    component: NewUserComponent,
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
export class AppRoutingModule { }
