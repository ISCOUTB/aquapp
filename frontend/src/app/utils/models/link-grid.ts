import { QueryParameters } from './url';

export interface LinkGridElement {
  title: string;
  description: string;
  url: string[];
  queryParameters: QueryParameters;
  [prop: string]: any;
}
