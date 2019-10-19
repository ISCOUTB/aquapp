import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-admin',
  templateUrl: './new-admin.component.html',
  styleUrls: ['./new-admin.component.scss'],
})
export class NewAdminComponent implements OnInit {
  title = 'Nuevo usuario administrador';
  constructor() {}

  ngOnInit() {}
}
