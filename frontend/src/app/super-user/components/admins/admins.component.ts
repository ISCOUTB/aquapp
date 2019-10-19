import { Component, OnInit } from '@angular/core';
import { Action, Column } from 'src/app/utils/models/table';
import { QueryParameters } from 'src/app/utils/models/url';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss'],
})
export class AdminsComponent implements OnInit {
  actions: Action[] = [
    {
      name: 'edit',
      route: ['/', 'new-admin'],
      parameters: {},
      icon: '',
      color: 'black',
      idPropertyName: 'id',
    },
    {
      name: 'delete',
      route: [],
      parameters: {},
      icon: '',
      color: 'black',
      idPropertyName: 'id',
    },
  ];
  columns: Column[] = [
    {
      title: 'Name',
      property: 'name',
    },
  ];
  newElementRoute = ['/', 'new-admin'];

  getElementsEndpoint = '/users/jsonata';
  getElementsQueryParams: QueryParameters = {
    query: `(
      [$]
    )`,
  };

  deleteElementEndpoint = '/users';

  constructor() {}

  ngOnInit() {}
}
