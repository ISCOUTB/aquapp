import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './mongo.datasource.json';

export class MongoDataSource extends juggler.DataSource {
  static dataSourceName = 'Mongo';

  constructor(
    @inject('datasources.config.Mongo', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
