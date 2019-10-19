import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Action, Column } from '../../models/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() getElementsEndpoint: string;
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
    this.getElements();
  }

  getElements() {
    this.loading = true;
    this.apiService.get(this.getElementsEndpoint, {}).subscribe(
      (elements: any[]) => {
        this.data = elements;
      },
      () => {},
      () => {
        this.loading = false;
      },
    );
  }

  triggerAction(object: any, action: Action) {
    const params = {
      ...action.parameters,
    };
    params[action.idPropertyName] = object.id;
    this.router.navigate(action.route, {
      queryParams: params,
    });
  }
}
