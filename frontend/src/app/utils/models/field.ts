export interface Field {
  name: string;
  title: string;
  type: string;
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
