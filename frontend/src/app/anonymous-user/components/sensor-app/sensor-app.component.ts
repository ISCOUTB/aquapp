import { Component, OnInit } from '@angular/core';
import { MessagesService } from 'src/app/utils/services/messages.service';
import { MESSAGES } from 'src/app/messages';

@Component({
  selector: 'app-sensor-app',
  templateUrl: './sensor-app.component.html',
  styleUrls: ['./sensor-app.component.scss'],
})
export class SensorAppComponent implements OnInit {
  constructor(private messageService: MessagesService) {}

  ngOnInit() {
    this.messageService.sendMessage({ name: MESSAGES.closeSidenav, value: {} });
    this.messageService.sendMessage({
      name: MESSAGES.fullWidthContent,
      value: {},
    });
  }
}
