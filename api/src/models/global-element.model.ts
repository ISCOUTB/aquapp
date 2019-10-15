import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class GlobalElement extends Entity {
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

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<GlobalElement>) {
    super(data);
  }
}

export interface ElementoGlobalRelations {
  // describe navigational properties here
}

export type ElementoGlobalWithRelations = GlobalElement & ElementoGlobalRelations;
