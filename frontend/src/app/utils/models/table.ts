import { QueryParameters } from './url';

export type TransformationFn = (value: any) => string;

export interface Action {
  name: string;
  route: string[];
  parameters: QueryParameters;
  icon: string;
  color: string;
  idPropertyName: string;
}

export interface Column {
  title: string;
  property: string;
  transformation?: TransformationFn;
}
