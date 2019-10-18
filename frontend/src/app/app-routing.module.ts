import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './anonymous-user/components/login/login.component';
import { GetStartPageComponent } from './utils/components/get-start-page/get-start-page.component';
import { SuperuserStartPageComponent } from './super-user/components/superuser-start-page/superuser-start-page.component';
import { AdminStartPageComponent } from './admin-user/components/admin-start-page/admin-start-page.component';
import { AnonymousUserStartPageComponent } from './anonymous-user/components/anonymous-user-start-page/anonymous-user-start-page.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'superuser', component: SuperuserStartPageComponent },
  { path: 'admin', component: AdminStartPageComponent },
  {
    path: 'inicio',
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
