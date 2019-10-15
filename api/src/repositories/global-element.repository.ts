import {DefaultCrudRepository} from '@loopback/repository';
import {GlobalElement, ElementoGlobalRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class GlobalElementRepository extends DefaultCrudRepository<
  GlobalElement,
  typeof GlobalElement.prototype.id,
  ElementoGlobalRelations
> {
  constructor(
    @inject('datasources.Mongo') dataSource: MongoDataSource,
  ) {
    super(GlobalElement, dataSource);
  }
}
