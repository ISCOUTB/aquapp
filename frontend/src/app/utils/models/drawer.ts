import { QueryParameters } from './url';

export interface DrawerElement {
  title: string;
  url: string[];
  queryParameters: QueryParameters;
  icon: string;
  [prop: string]: any;
}
