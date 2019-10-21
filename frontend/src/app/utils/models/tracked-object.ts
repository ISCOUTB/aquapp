import { Element } from './element';
import { Form } from './form';

export interface TrackedObject extends Element {
  form: Form | string;
  trackedProperties: string[];
  [prop: string]: any;
}
