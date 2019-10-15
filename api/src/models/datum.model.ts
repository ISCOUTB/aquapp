import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Datum extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  sensor?: string;

  @property({
    type: 'string',
  })
  trackedObject?: string;

  @property({
    type: 'string',
  })
  user?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(datum?: Partial<Datum>) {
    super(datum);
  }
}

export interface DatumRelations {
  // describe navigational properties here
}

export type DatumWithRelations = Datum & DatumRelations;
