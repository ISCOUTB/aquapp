import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface Hour {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-dialog-date-time',
  templateUrl: './dialog-date-time.component.html',
  styleUrls: ['./dialog-date-time.component.scss']
})
export class DialogDateTimeComponent implements OnInit {
  hours: Hour[] = [
    { value: '6', viewValue: '6:00 AM' },
    { value: '7', viewValue: '7:00 AM' },
    { value: '8', viewValue: '8:00 AM' },
    { value: '9', viewValue: '9:00 AM' },
    { value: '10', viewValue: '10:00 AM' },
    { value: '11', viewValue: '11:00 AM' },
    { value: '12', viewValue: '12:00 PM' },
    { value: '13', viewValue: '1:00 PM' },
    { value: '14', viewValue: '2:00 PM' },
    { value: '15', viewValue: '3:00 PM' },
    { value: '16', viewValue: '4:00 PM' },
    { value: '17', viewValue: '5:00 PM' },
    { value: '18', viewValue: '6:00 PM' },
    { value: '19', viewValue: '7:00 PM' },
    { value: '20', viewValue: '8:00 PM' },
    { value: '21', viewValue: '9:00 PM' },
  ];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {

  }

}
