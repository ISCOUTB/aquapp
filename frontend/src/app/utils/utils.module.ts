import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './services/api.service';
import { StorageService } from './services/storage.service';
import { MessagesService } from './services/messages.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [ApiService, StorageService, MessagesService]
})
export class UtilsModule { }
