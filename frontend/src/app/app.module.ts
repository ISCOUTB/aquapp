import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AnonymousUserModule } from './anonymous-user/anonymous-user.module';
import { SuperUserModule } from './super-user/super-user.module';
import { UtilsModule } from './utils/utils.module';
import { AdminUserModule } from './admin-user/admin-user.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AnonymousUserModule,
    SuperUserModule,
    AdminUserModule,
    UtilsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
