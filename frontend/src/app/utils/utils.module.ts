import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './services/api.service';
import { StorageService } from './services/storage.service';
import { MessagesService } from './services/messages.service';
import { TableComponent } from './components/table/table.component';
import {
  MatTableModule,
  MatButtonModule,
  MatPaginatorModule,
  MatSortModule,
  MatProgressSpinnerModule,
} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { ParticlesBackgroundComponent } from './components/particles-background/particles-background.component';
import { GetStartPageComponent } from './components/get-start-page/get-start-page.component';

const components = [
  TableComponent,
  ParticlesBackgroundComponent,
  GetStartPageComponent,
];

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    HttpClientModule,
  ],
  providers: [ApiService, StorageService, MessagesService],
  exports: components,
})
export class UtilsModule {}
