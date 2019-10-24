import { Component, OnInit } from '@angular/core';
import { Column, Action } from 'src/app/utils/models/table';
import { QueryParameters } from 'src/app/utils/models/url';
import { ROUTES } from 'src/app/routes';

@Component({
  selector: 'app-tracked-objects',
  templateUrl: './tracked-objects.component.html',
  styleUrls: ['./tracked-objects.component.scss'],
})
export class TrackedObjectsComponent implements OnInit {
  actions: Action[] = [
    {
      name: 'data',
      route: ['/', ROUTES.data],
      parameters: {},
      icon: 'bar_chart',
      color: 'primary',
      idPropertyName: 'trackedObjectId',
    },
    {
      name: 'clone',
      route: ['/', ROUTES.data],
      parameters: {},
      icon: 'library_add',
      color: 'primary',
      idPropertyName: 'trackedObjectId',
    },
    {
      name: 'edit',
      route: ['/', ROUTES.newTrackedObject],
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
    {
      title: 'Formulario',
      property: 'populatedForm',
      transformation: (value: any) => value.name as string,
    },
  ];
  newElementRoute = ['/', ROUTES.newTrackedObject];

  getElementsEndpoint = '/elements/jsonata';
  getElementsQueryParams: QueryParameters = {
    query: `(
      [$]
    )`,
    additionalFilters: JSON.stringify([
      {
        category: 'tracked-objects',
      },
    ]),
    populate: 'true',
  };
  pageSize = 10;
  deleteElementEndpoint = '/elements';
  constructor() {}

  ngOnInit() {}
}
