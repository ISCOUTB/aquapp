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

@NgModule({
  declarations: [TableComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
  ],
  providers: [ApiService, StorageService, MessagesService],
})
export class UtilsModule {}
