import { Component, OnInit } from '@angular/core';
import { Column, Action } from 'src/app/utils/models/table';
import { QueryParameters } from 'src/app/utils/models/url';
import { ROUTES } from 'src/app/routes';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent implements OnInit {
  actions: Action[] = [
    {
      name: 'clone',
      route: ['/', ROUTES.roles],
      parameters: {},
      icon: 'library_add',
      color: 'primary',
      idPropertyName: 'trackedObjectId',
    },
    {
      name: 'edit',
      route: ['/', ROUTES.newRole],
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
  newElementRoute = ['/', ROUTES.newRole];

  getElementsEndpoint = '/elements/jsonata';
  getElementsQueryParams: QueryParameters = {
    query: `(
      [$]
    )`,
    additionalFilters: JSON.stringify([
      {
        category: 'roles',
      },
    ]),
  };
  pageSize = 10;
  deleteElementEndpoint = '/elements';
  constructor() {}

  ngOnInit() {}
}
