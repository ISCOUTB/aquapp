import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Element extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  category: string;

  @property({
    type: 'string',
  })
  form?: string;

  @property({
    type: 'string',
  })
  user?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Element>) {
    super(data);
  }
}

export interface ElementRelations {
  // describe navigational properties here
}

export type ElementoWithRelations = Element & ElementRelations;
