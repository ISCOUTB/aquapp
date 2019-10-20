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
      title: 'Name',
      property: 'name',
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
  };

  deleteElementEndpoint = '/elements';
  constructor() {}

  ngOnInit() {}
}
