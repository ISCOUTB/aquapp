import {DefaultCrudRepository} from '@loopback/repository';
import {Element, ElementoRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ElementRepository extends DefaultCrudRepository<
  Element,
  typeof Element.prototype.id,
  ElementoRelations
> {
  constructor(
    @inject('datasources.Mongo') dataSource: MongoDataSource,
  ) {
    super(Element, dataSource);
  }
}
