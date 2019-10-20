import { Field } from './field';

export type ValidatorFn = (value: any) => boolean;

export class Validator {
  static validators: { [prop: string]: ValidatorFn } = {
    string: (value: any) => typeof value === 'string',
    number: (value: any) => typeof value === 'number',
    latitude: (value: any) =>
      typeof value === 'number' && value >= -90 && value <= 90,
    longitude: (value: any) =>
      typeof value === 'number' && value >= -180 && value <= 180,
  };
  static validate(field: Field, value: any): boolean {
    return field.validators.every(validator =>
      Validator.validators[validator](value),
    );
  }
}
