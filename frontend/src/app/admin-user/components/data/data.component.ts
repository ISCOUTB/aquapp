import { Component, OnInit } from '@angular/core';
import { Column, Action } from 'src/app/utils/models/table';
import { QueryParameters } from 'src/app/utils/models/url';
import { ROUTES } from 'src/app/routes';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/utils/services/api.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
})
export class DataComponent implements OnInit {
  actions: Action[] = [
    {
      name: 'edit',
      route: ['/', ROUTES.newDatum],
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
      title: 'Fecha de creación',
      property: 'createdAt',
      transformation: (value: number) =>
        new Date(value).toLocaleDateString('es'),
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
    order: '',
  };
  pageSize = 10;
  deleteElementEndpoint = '/data';
  init = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit() {
    this.apiService
      .get(
        `/elements/${this.activatedRoute.snapshot.queryParams.trackedObjectId}`,
        {
          populate: 'true',
        },
      )
      .subscribe((element: any) => {
        if (!!element.columns && element.columns.length) {
          for (const column of element.columns) {
            const field = element.form.fields.find(
              (f: any) => f.name === column,
            );
            if (!!field) {
              const col: Column = {
                title: field.title,
                property: column,
              };
              if (field.type === 'date') {
                col.transformation = (value: any) =>
                  this.datePipe.transform(value, 'mediumDate');
              }
              this.columns.push(col);
            }
          }
        }

        if (!!element.sort) {
          this.getElementsQueryParams.order = JSON.stringify([
            `${element.sort} ASC`,
          ]);
        }
        this.getElementsQueryParams.additionalFilters = JSON.stringify([
          {
            trackedObject: this.activatedRoute.snapshot.queryParams
              .trackedObjectId,
          },
        ]);
        this.init = true;
      });
  }
}
