import {Filter, repository} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  del,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import {Datum} from '../models';
import {
  DatumRepository,
  ElementRepository,
  UserRepository,
} from '../repositories';
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
    @repository(UserRepository)
    public userRepository: UserRepository,
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
    const admin = await this.miscTools.getAdmin(currentUserProfile.id);
    const currentUser = await this.userRepository.findById(
      currentUserProfile.id,
    );
    await this.miscTools.populateUser(currentUser);
    this.miscTools.validateOperationAndGetFilters('data', 'post', currentUser);
    await this.formTools.validateDatum(datum);
    const trackedObject = await this.elementsRepository.findById(
      datum.trackedObject,
    );

    datum.active = true;
    datum.createdAt = this.miscTools.gmtM5(Date.now());

    datum.sensor = sensorId ? sensorId : 'no-sensor';
    datum.user = admin.id;

    for (const calculatedField of trackedObject.calculatedFields) {
      switch (calculatedField) {
        case 'ICAMpff':
          datum.icampff = await this.miscTools.icampff(datum);
          break;
        default:
          break;
      }
    }

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
    @param.query.string('additionalFilters') additionalFilters: string,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUserProfile: UserProfile,
    @param.query.number('pageSize') pageSize: number,
    @param.query.number('offset') offset: number,
  ) {
    const admin = await this.miscTools.getAdmin(currentUserProfile.id);
    const currentUser = await this.userRepository.findById(
      currentUserProfile.id,
    );
    await this.miscTools.populateUser(currentUser);
    const currentUserRoleFilters = this.miscTools.validateOperationAndGetFilters(
      'data',
      'get',
      currentUser,
    );
    const filters: any[] = [
      {active: true},
      {user: admin.id},
      ...currentUserRoleFilters,
    ];
    const additionalFiltersArray: any[] =
      additionalFilters !== undefined ? JSON.parse(additionalFilters) : [];
    if (additionalFilters !== undefined && additionalFilters.length) {
      filters.splice(0, 0, ...additionalFiltersArray);
    }
    if (sensor !== undefined) {
      filters.splice(0, 0, {sensor});
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
            where: {and: filters},
            order: ordenUsuario.length ? ordenUsuario : ['createdAt ASC'],
            offset: offset,
            limit: pageSize,
          }
        : {
            where: {and: filters},
            order: ordenUsuario.length ? ordenUsuario : ['createdAt ASC'],
          };
    let data: Datum[] = await this.datumRepository.find(dbQuery, {
      strictObjectIDCoercion: true,
    });
    let realSize = await this.datumRepository.count(
      {and: filters},
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

  @get('/data/open/vm2', {
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
  async findVM2Open(
    @param.query.string('order') order: string,
    @param.query.string('query')
    query: string,
    @param.query.string('sensor')
    sensor: string,
    @param.query.string('additionalFilters') additionalFilters: string,
    @param.query.number('pageSize') pageSize: number,
    @param.query.number('offset') offset: number,
  ) {
    const filters: any[] = [{active: true}];
    const additionalFiltersArray: any[] =
      additionalFilters !== undefined ? JSON.parse(additionalFilters) : [];
    if (additionalFilters !== undefined && additionalFilters.length) {
      filters.splice(0, 0, ...additionalFiltersArray);
    }
    if (sensor !== undefined) {
      filters.splice(0, 0, {sensor});
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
            where: {and: filters},
            order: ordenUsuario.length ? ordenUsuario : ['createdAt ASC'],
            offset: offset,
            limit: pageSize,
          }
        : {
            where: {and: filters},
            order: ordenUsuario.length ? ordenUsuario : ['createdAt ASC'],
          };
    let data: Datum[] = await this.datumRepository.find(dbQuery, {
      strictObjectIDCoercion: true,
    });
    let realSize = await this.datumRepository.count(
      {and: filters},
      {
        strictObjectIDCoercion: true,
      },
    );
    console.log(JSON.stringify(filters));
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
  async findById(
    @param.path.string('id') id: string,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUserProfile: UserProfile,
  ): Promise<Datum> {
    const admin = await this.miscTools.getAdmin(currentUserProfile.id);
    const currentUser = await this.userRepository.findById(
      currentUserProfile.id,
    );
    await this.miscTools.populateUser(currentUser);
    this.miscTools.validateOperationAndGetFilters(
      'elements',
      'post',
      currentUser,
    );
    const datum = await this.datumRepository.findById(id);
    if (datum.user !== admin.id) {
      throw new HttpErrors.Unauthorized(`Not enough permissions`);
    }
    return datum;
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
    changes: Datum,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUserProfile: UserProfile,
  ): Promise<void> {
    const admin = await this.miscTools.getAdmin(currentUserProfile.id);
    const currentUser = await this.userRepository.findById(
      currentUserProfile.id,
    );
    await this.miscTools.populateUser(currentUser);
    this.miscTools.validateOperationAndGetFilters(
      'elements',
      'post',
      currentUser,
    );
    const datum = await this.datumRepository.findById(id);
    if (changes.user !== admin.id) {
      throw new HttpErrors.Unauthorized(`Not enough permissions`);
    }
    const trackedObject = await this.elementsRepository.findById(datum.id);
    for (const calculatedField of trackedObject.calculatedFields) {
      switch (calculatedField) {
        case 'ICAMpff':
          changes.icampff = await this.miscTools.icampff(datum);
          break;
        default:
          break;
      }
    }
    await this.formTools.validateDatum(changes);
    await this.datumRepository.updateById(id, changes);
  }

  @del('/data/{id}', {
    responses: {
      '204': {
        description: 'Datum DELETE success',
      },
    },
  })
  @authenticate('jwt')
  async deleteById(
    @param.path.string('id') id: string,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUserProfile: UserProfile,
  ): Promise<void> {
    const admin = await this.miscTools.getAdmin(currentUserProfile.id);
    const currentUser = await this.userRepository.findById(
      currentUserProfile.id,
    );
    await this.miscTools.populateUser(currentUser);
    this.miscTools.validateOperationAndGetFilters(
      'elements',
      'post',
      currentUser,
    );
    const datum = await this.datumRepository.findById(id);
    if (datum.user !== admin.id) {
      throw new HttpErrors.Unauthorized(`Not enough permissions`);
    }
    datum.active = false;
    await this.datumRepository.save(datum);
  }
}
