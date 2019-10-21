export interface Field {
  name: string;
  title: string;
  type: string;
  description: string;
  required: boolean;
  hidden: boolean;
  readOnly: boolean;
  validators: string[];
}

export interface TextField extends Field {
  defaultValue: string;
}

export interface NumberField extends Field {
  defaultValue: number;
}

export interface TrackedObjectField extends Field {
  trackedObject: any;
  multi: boolean;
  populate: boolean;
  form: string;
}

export const FIELD_TYPES = [
  {
    name: 'short-text',
    title: 'Texto',
    validators: [],
  },
  {
    name: 'date',
    title: 'Fecha',
    validators: [],
  },
  {
    name: 'number',
    title: 'Número',
    validators: [
      {
        name: 'latitude',
        title: 'Latitud',
      },
      {
        name: 'longitude',
        title: 'Longitud',
      },
    ],
  },
  {
    name: 'tracked-object',
    title: 'Objeto(s) monitoreado(s)',
    validators: [],
  },
];
