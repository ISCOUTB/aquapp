import { Component, OnInit } from '@angular/core';
import { LinkGridElement } from 'src/app/utils/models/link-grid';

@Component({
  selector: 'app-admin-start-page',
  templateUrl: './admin-start-page.component.html',
  styleUrls: ['./admin-start-page.component.scss'],
})
export class AdminStartPageComponent implements OnInit {
  shortcuts: LinkGridElement[] = [
    {
      title: 'Objetos',
      description: `Creación de objetos`,
      url: ['/', 'tracked-objects'],
      queryParameters: {},
    },
  ];
  constructor() {}

  ngOnInit() {}
}
