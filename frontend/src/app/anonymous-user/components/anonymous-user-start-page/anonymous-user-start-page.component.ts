import { Component, OnInit } from '@angular/core';
import { LinkGridElement } from 'src/app/utils/models/link-grid';
import { ROUTES } from 'src/app/routes';
import { MessagesService } from 'src/app/utils/services/messages.service';
import { MESSAGES } from 'src/app/messages';

@Component({
  selector: 'app-anonymous-user-start-page',
  templateUrl: './anonymous-user-start-page.component.html',
  styleUrls: ['./anonymous-user-start-page.component.scss'],
})
export class AnonymousUserStartPageComponent implements OnInit {
  links: LinkGridElement[] = [
    {
      title: 'AquApp',
      description: `Sistema de monitoreo de los lagos y
  lagunas de Cartagena de Indias`,
      url: ['/', ROUTES.aquapp],
      queryParameters: {},
    },
    {
      title: 'SensorApp',
      description: `Sistema de rastreo de los puntos de
      concentración de estudiantes en la UTB.`,
      url: ['/', ROUTES.sensorApp],
      queryParameters: {},
    },
  ];
  constructor(private messageService: MessagesService) {}

  ngOnInit() {
    this.messageService.sendMessage({ name: MESSAGES.closeSidenav, value: {} });
    this.messageService.sendMessage({
      name: MESSAGES.fullWidthContent,
      value: {},
    });
  }
}
