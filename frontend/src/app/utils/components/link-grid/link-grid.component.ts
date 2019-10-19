import { Component, OnInit, Input } from '@angular/core';
import { LinkGridElement } from '../../models/link-grid';

@Component({
  selector: 'app-link-grid',
  templateUrl: './link-grid.component.html',
  styleUrls: ['./link-grid.component.scss'],
})
export class LinkGridComponent implements OnInit {
  @Input() columns = 3;
  @Input() height = 200;
  @Input() elements: LinkGridElement[] = [];
  constructor() {}

  ngOnInit() {}
}
