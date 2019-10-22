import { Component, OnInit } from '@angular/core';
import { Column, Action } from 'src/app/utils/models/table';
import { QueryParameters } from 'src/app/utils/models/url';
import { ROUTES } from 'src/app/routes';
import { StorageService } from 'src/app/utils/services/storage.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  actions: Action[] = [
    {
      name: 'clone',
      route: ['/', ROUTES.newUser],
      parameters: {},
      icon: 'library_add',
      color: 'primary',
      idPropertyName: 'trackedObjectId',
    },
    {
      name: 'edit',
      route: ['/', ROUTES.newUser],
      parameters: {},
      icon: 'edit',
      color: 'primary',
      idPropertyName: 'id',
    },
    {
      name: 'delete',
      route: [],
      parameters: {},
      icon: 'delete',
      color: 'warn',
      idPropertyName: 'id',
    },
  ];
  columns: Column[] = [
    {
      title: 'Nombre',
      property: 'name',
    },
    {
      title: 'Descripción',
      property: 'description',
    },
  ];
  newElementRoute = ['/', ROUTES.newUser];

  getElementsEndpoint = '/users/jsonata';
  getElementsQueryParams: QueryParameters = {
    query: `(
      [$]
    )`,
  };
  pageSize = 10;
  deleteElementEndpoint = '/users';
  constructor() {}

  ngOnInit() {}
}
