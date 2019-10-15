import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './anonymous-user/components/login/login.component';
import { GetStartPageComponent } from './utils/components/get-start-page/get-start-page.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'get-start-page', component: GetStartPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
