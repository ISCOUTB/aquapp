import { Component, OnInit } from '@angular/core';
import { Column, Action } from 'src/app/utils/models/table';
import { QueryParameters } from 'src/app/utils/models/url';
import { ROUTES } from 'src/app/routes';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
})
export class DataComponent implements OnInit {
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
  newElementRoute = ['/', ROUTES.newDatum];

  getElementsEndpoint = '/data/vm2';
  getElementsQueryParams: QueryParameters = {
    query: `(
      {
        data: this.data,
        total: this.total
      }
    )`,
    additionalFilters: JSON.stringify([
      {
        category: 'tracked-objects',
      },
    ]),
  };
  pageSize = 10;
  deleteElementEndpoint = '/elements';
  constructor() {}

  ngOnInit() {}
}
