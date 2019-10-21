import { Component, OnInit } from '@angular/core';
import { Column, Action } from 'src/app/utils/models/table';
import { QueryParameters } from 'src/app/utils/models/url';
import { ROUTES } from 'src/app/routes';
import { ActivatedRoute } from '@angular/router';

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
    additionalFilters: '',
  };
  pageSize = 10;
  deleteElementEndpoint = '/elements';
  init = false;
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.getElementsQueryParams.additionalFilters = JSON.stringify([
      {
        trackedObject: this.activatedRoute.snapshot.queryParams.trackedObjectId,
      },
    ]);
    this.init = true;
  }
}
