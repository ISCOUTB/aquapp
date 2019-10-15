import {DefaultCrudRepository} from '@loopback/repository';
import {Datum, DatumRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class DatumRepository extends DefaultCrudRepository<
  Datum,
  typeof Datum.prototype.id,
  DatumRelations
> {
  constructor(
    @inject('datasources.Mongo') dataSource: MongoDataSource,
  ) {
    super(Datum, dataSource);
  }
}
