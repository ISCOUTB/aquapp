import { Component, OnInit } from '@angular/core';
import { Column, Action } from 'src/app/utils/models/table';
import { QueryParameters } from 'src/app/utils/models/url';
import { ROUTES } from 'src/app/routes';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
})
export class FormsComponent implements OnInit {
  actions: Action[] = [
    {
      name: 'edit',
      route: ['/', ROUTES.newForm],
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
  newElementRoute = ['/', ROUTES.newForm];

  getElementsEndpoint = '/elements/jsonata';
  getElementsQueryParams: QueryParameters = {
    query: `(
      [$]
    )`,
    additionalFilters: JSON.stringify([
      {
        category: 'forms',
      },
    ]),
  };

  deleteElementEndpoint = '/elements';
  constructor() {}

  ngOnInit() {}
}
