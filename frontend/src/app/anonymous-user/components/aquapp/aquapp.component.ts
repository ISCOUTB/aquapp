import { Component, OnInit } from '@angular/core';
import { MessagesService } from 'src/app/utils/services/messages.service';
import { MESSAGES } from 'src/app/messages';

@Component({
  selector: 'app-aquapp',
  templateUrl: './aquapp.component.html',
  styleUrls: ['./aquapp.component.scss'],
})
export class AquappComponent implements OnInit {
  constructor(private messageService: MessagesService) {}

  ngOnInit() {
    this.messageService.sendMessage({ name: MESSAGES.closeSidenav, value: {} });
    this.messageService.sendMessage({
      name: MESSAGES.fullWidthContent,
      value: {},
    });
  }
}
