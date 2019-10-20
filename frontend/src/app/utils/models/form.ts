import { Field } from './field';
import { Element } from './element';

export interface Form extends Element {
  fields: Field[];
}
