import { QueryParameters } from './url';

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
}
