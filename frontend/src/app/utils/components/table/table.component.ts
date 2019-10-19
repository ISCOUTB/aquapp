import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Action, Column } from '../../models/table';
import { QueryParameters } from '../../models/url';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() getElementsEndpoint: string;
  @Input() getElementsQueryParams: QueryParameters = {};
  @Input() newElementRoute: string[];
  @Input() newElementQueryParams: QueryParameters = {};
  @Input() deleteElementEndpoint: string;
  @Input() actions: Action[];
  @Input() columns: Column[];
  @Input() pageSize = 10;
  tableColumns: string[] = [];
  loading = true;
  data: any[] = [];
  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    this.tableColumns = this.columns.map((column: Column) => column.title);
    this.tableColumns.push('Acciones');
    this.getElements();
  }

  getElements() {
    this.loading = true;
    this.apiService
      .get(this.getElementsEndpoint, this.getElementsQueryParams)
      .subscribe(
        (elements: any[]) => {
          this.data = elements;
        },
        () => {},
        () => {
          this.loading = false;
        },
      );
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
    if (action.name === 'delete') {
      this.loading = true;
      this.apiService
        .delete(
          `${this.deleteElementEndpoint}/${object.id}`,
          this.getQueryParameters(action, object.id),
        )
        .subscribe(
          () => console.log('Deleted successfully'),
          () => console.log('Error deleting'),
          () => (this.loading = false),
        );
      return;
    }
    this.router.navigate(action.route, {
      queryParams: this.getQueryParameters(action, object.id),
    });
  }
}
