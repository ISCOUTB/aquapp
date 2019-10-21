import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Action, Column } from '../../models/table';
import { QueryParameters } from '../../models/url';
import { MatPaginator, MatSort } from '@angular/material';
import { merge } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, AfterViewInit {
  @Input() getElementsEndpoint: string;
  @Input() getElementsQueryParams: QueryParameters = {};
  @Input() newElementRoute: string[];
  @Input() newElementQueryParams: QueryParameters = {};
  @Input() deleteElementEndpoint: string;
  @Input() actions: Action[];
  @Input() columns: Column[];
  @Input() pageSize = 10;
  loading = true;
  data: any[] = [];
  tableColumns: string[] = [];
  total = 0;
  @ViewChild(MatPaginator, { read: MatPaginator, static: false })
  paginator: MatPaginator;
  @ViewChild(MatSort, { read: MatSort, static: false }) sort: MatSort;
  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    this.tableColumns = this.columns.map((column: Column) => column.title);
    this.tableColumns.push('Acciones');
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.paginator.pageSize = this.pageSize;
      merge(this.sort.sortChange, this.paginator.page).subscribe({
        next: () => this.getElements(),
      });
      this.getElements();
    }, 100);
  }

  getElements() {
    this.loading = true;
    this.apiService
      .get(this.getElementsEndpoint, {
        ...this.getElementsQueryParams,
        limit: this.pageSize.toString(),
        offset: (this.pageSize * this.paginator.pageIndex).toString(),
      })
      .subscribe({
        next: (elements: any) => {
          this.data = elements.data;
          this.total = elements.total;
        },
        error: () => {},
        complete: () => (this.loading = false),
      });
  }

  getQueryParameters(action: Action, id: string) {
    const parameters = { ...action.parameters };
    parameters[action.idPropertyName || 'id'] = id;
    return parameters;
  }

  newElement() {
    this.router.navigate(this.newElementRoute, {
      queryParams: this.newElementQueryParams,
      queryParamsHandling: 'merge',
    });
  }

  triggerAction(object: any, action: Action) {
    if (object.id === undefined) {
      console.log('OBJECT ID UNDEFINED');
      return;
    }
    if (action.name === 'clone') {
      this.apiService
        .post(
          `${this.deleteElementEndpoint}`,
          this.getQueryParameters(action, object.id),
          {
            ...object,
            id: undefined,
            name: `${object.name} (copia)`,
          },
        )
        .subscribe(
          () => {
            console.log('Cloned successfully');
            this.getElements();
          },
          () => console.log('Error cloning'),
          () => (this.loading = false),
        );
      return;
    }
    if (
      action.name === 'delete' &&
      window.confirm('¿Está seguro de eliminar?')
    ) {
      this.loading = true;
      this.apiService
        .delete(
          `${this.deleteElementEndpoint}/${object.id}`,
          this.getQueryParameters(action, object.id),
        )
        .subscribe(
          () => {
            console.log('Deleted successfully');
            this.getElements();
          },
          () => console.log('Error deleting'),
          () => (this.loading = false),
        );
      return;
    }
    this.router.navigate(action.route, {
      queryParams: this.getQueryParameters(action, object.id),
      queryParamsHandling: 'merge',
    });
  }
}
