import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { NewConditionComponent } from '../new-condition/new-condition.component';

export interface Condition {
  name: string;
  property: string;
  operator: string;
  value: any | any[];
  valueType: string;
  query: any;
}

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.scss'],
})
export class ConditionsComponent implements OnInit {
  @Input() form: FormGroup;
  conditions: Condition[] = [];
  operators = [
    {
      name: '=',
      title: 'Igual',
    },
    {
      name: '!=',
      title: 'Diferente de',
    },
    {
      name: '>',
      title: 'Mayor que',
    },
    {
      name: '<',
      title: 'Menor que',
    },
  ];

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.form.get('conditions').valueChanges.subscribe({
      next: (conditions: any) => (this.conditions = conditions),
    });
  }

  add() {
    const dialogRef = this.dialog.open(NewConditionComponent, {
      width: '80%',
      maxWidth: '350px',
      maxHeight: '600px',
      height: '80%',
      hasBackdrop: true,
      data: { operators: this.operators },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.conditions.push(result);
        this.form.get('conditions').setValue(this.conditions);
      }
    });
  }

  edit(index: number) {
    const dialogRef = this.dialog.open(NewConditionComponent, {
      width: '80%',
      maxWidth: '350px',
      maxHeight: '600px',
      height: '80%',
      data: { condition: this.conditions[index], operators: this.operators },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.conditions[index] = result;
        result.value = this.serializeValue(result);
        result.query = this.generateQuery(result);
        this.form.get('conditions').setValue(this.conditions);
      }
    });
  }

  generateQuery(condition: Condition) {
    const innerQuery: any = {};
    const outerQuery: any = {};
    switch (condition.operator) {
      case '>':
        innerQuery.gt = condition.value;
        break;
      case '<':
        innerQuery.lt = condition.value;
        break;
      case '!=':
        innerQuery.ne = condition.value;
        break;
      default:
        innerQuery.eq = condition.value;
    }
    outerQuery[condition.property] = innerQuery;
    return outerQuery;
  }

  serializeValue(condition: Condition) {
    switch (condition.valueType) {
      case 'number':
        return parseFloat(condition.value);
      default:
        return condition.value;
    }
  }

  deserializeValue(condition: Condition) {
    return {};
  }

  remove(index: number) {
    if (!window.confirm('¿Está seguro de elminar la condición?')) {
      return;
    }
    this.conditions.splice(index, 1);
    this.form.get('conditions').setValue(this.conditions);
  }
}
