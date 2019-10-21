import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  del,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import {Datum} from '../models';
import {DatumRepository, ElementRepository} from '../repositories';
import {
  authenticate,
  AuthenticationBindings,
  UserProfile,
} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {FormTools} from '../services/form-tools';
import {MiscTools} from '../services/misc-tools';
import * as vm2 from 'vm2';

export class DatumController {
  constructor(
    @repository(DatumRepository)
    public datumRepository: DatumRepository,
    @repository(ElementRepository)
    public elementsRepository: ElementRepository,
    @inject('FormTools')
    public formTools: FormTools,
    @inject('MiscTools')
    public miscTools: MiscTools,
  ) {}

  @post('/data', {
    responses: {
      '200': {
        description: 'Datum model instance',
        content: {'application/json': {schema: getModelSchemaRef(Datum)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Datum, {exclude: ['id']}),
        },
      },
    })
    datum: Omit<Datum, 'id'>,
    @param.query.string('sensor') sensorId: string,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUserProfile: UserProfile,
  ): Promise<Datum> {
    await this.formTools.validateDatum(datum);
    const trackedObject = await this.elementsRepository.findById(
      datum.trackedObject,
    );

    datum.active = true;
    datum.createdAt = this.miscTools.gmtM5(Date.now());

    datum.sensor = sensorId;
    datum.trackedObject = trackedObject.id;
    datum.user = currentUserProfile.id;

    trackedObject.lastDatum = datum;
    await this.elementsRepository.save(trackedObject);

    return this.datumRepository.create(datum);
  }

  @get('/data/vm2', {
    responses: {
      '200': {
        description: 'Array of Datum model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Datum}},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async findVM2(
    @param.query.string('order') order: string,
    @param.query.string('query')
    query: string,
    @param.query.string('sensor')
    sensor: string,
    @param.query.string('filtrosAdicionales') additionalFilters: string,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUserProfile: UserProfile,
    @param.query.number('pageSize') pageSize: number,
    @param.query.number('offset') offset: number,
  ) {
    const filtros: any[] = [{active: true}, {user: currentUserProfile.id}];
    const filtrosAdicionalesArreglo: any[] =
      additionalFilters !== undefined ? JSON.parse(additionalFilters) : [];
    if (additionalFilters !== undefined && additionalFilters.length) {
      filtros.splice(0, 0, ...filtrosAdicionalesArreglo);
    }
    if (sensor !== undefined) {
      filtros.splice(0, 0, {sensor: sensor});
    }
    let ordenUsuario: string[] = [];
    if (order !== undefined && order.length) {
      const ordenArreglo = JSON.parse(order);
      if (ordenArreglo.length) {
        ordenUsuario = ordenArreglo.map(
          (o: any) => `${o.field} ${o.direction.toUpperCase()}`,
        );
      }
    }
    const t1 = Date.now();
    const dbQuery: Filter<Datum> =
      offset !== undefined && pageSize !== undefined
        ? {
            where: {and: filtros},
            order: ordenUsuario.length ? ordenUsuario : ['createdAt ASC'],
            offset: offset,
            limit: pageSize,
          }
        : {
            where: {and: filtros},
            order: ordenUsuario.length ? ordenUsuario : ['createdAt ASC'],
          };
    let data: Datum[] = await this.datumRepository.find(dbQuery, {
      strictObjectIDCoercion: true,
    });
    let realSize = await this.datumRepository.count(
      {and: filtros},
      {
        strictObjectIDCoercion: true,
      },
    );
    const t2 = Date.now();
    const vm = new vm2.VM({
      sandbox: {data: data, total: realSize.count},
      timeout: 1000,
      eval: false,
    });
    console.log('Query result size: ', data.length);
    console.log('Real size: ', realSize.count);
    const script = new vm2.VMScript(query);
    const result: any = vm.run(script);
    const t3 = Date.now();
    console.log('Db query time: ', (t2 - t1) / 1000);
    console.log('Query execution time: ', (t3 - t2) / 1000);
    console.log('Total time: ', (t3 - t1) / 1000);
    return result;
  }

  @get('/data/{id}', {
    responses: {
      '200': {
        description: 'Datum model instance',
        content: {'application/json': {schema: getModelSchemaRef(Datum)}},
      },
    },
  })
  @authenticate('jwt')
  async findById(@param.path.string('id') id: string): Promise<Datum> {
    return this.datumRepository.findById(id);
  }

  @patch('/data/{id}', {
    responses: {
      '204': {
        description: 'Datum PATCH success',
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Datum, {partial: true}),
        },
      },
    })
    datum: Datum,
  ): Promise<void> {
    await this.formTools.validateDatum(datum);
    await this.datumRepository.updateById(id, datum);
  }

  @del('/data/{id}', {
    responses: {
      '204': {
        description: 'Datum DELETE success',
      },
    },
  })
  @authenticate('jwt')
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    const datum = await this.datumRepository.findById(id);
    datum.active = false;
    await this.datumRepository.save(datum);
  }
}
