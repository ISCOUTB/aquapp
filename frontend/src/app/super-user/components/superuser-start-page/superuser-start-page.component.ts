import { Component, OnInit } from '@angular/core';
import { LinkGridElement } from 'src/app/utils/models/link-grid';

@Component({
  selector: 'app-superuser-start-page',
  templateUrl: './superuser-start-page.component.html',
  styleUrls: ['./superuser-start-page.component.scss'],
})
export class SuperuserStartPageComponent implements OnInit {
  shortcuts: LinkGridElement[] = [
    {
      title: 'Usuarios',
      description: `Creación de usuarios administradores`,
      url: ['/', 'admins'],
      queryParameters: {},
    },
  ];

  constructor() {}

  ngOnInit() {}
}
