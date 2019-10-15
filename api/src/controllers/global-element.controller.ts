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
import {GlobalElement} from '../models';
import {GlobalElementRepository} from '../repositories';
import {
  authenticate,
  AuthenticationBindings,
  UserProfile,
} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {MiscTools} from '../services/misc-tools';
import * as jsonata from 'jsonata';

export class GlobalElementController {
  constructor(
    @repository(GlobalElementRepository)
    public globalElementsRepository: GlobalElementRepository,
    @inject('MiscTools') public miscTools: MiscTools,
  ) {}

  @post('/global-elements', {
    responses: {
      '200': {
        description: 'GlobalElement model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(GlobalElement)},
        },
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GlobalElement, {exclude: ['id']}),
        },
      },
    })
    elementoGlobal: Omit<GlobalElement, 'id'>,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUserProfile: UserProfile,
  ): Promise<GlobalElement> {
    elementoGlobal.active = true;
    if (currentUserProfile.name !== 'superuser') {
      throw new HttpErrors.Unauthorized(`You don't have enough permissions`);
    }
    return this.globalElementsRepository.create(elementoGlobal);
  }

  @get('/global-elements/count', {
    responses: {
      '200': {
        description: 'GlobalElement model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(GlobalElement))
    where?: Where<GlobalElement>,
  ): Promise<Count> {
    return this.globalElementsRepository.count(where);
  }

  @get('/global-elements', {
    responses: {
      '200': {
        description: 'Array of GlobalElement model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(GlobalElement)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(GlobalElement))
    filter?: Filter<GlobalElement>,
  ): Promise<GlobalElement[]> {
    return this.globalElementsRepository.find(filter);
  }

  @get('/global-elements/jsonata', {
    responses: {
      '200': {
        description: 'Array of GlobalElement model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': GlobalElement}},
          },
        },
      },
    },
  })
  async findJsonata(
    @param.query.string('order') order: string,
    @param.query.string('query')
    query: string,
    @param.query.string('filtrosAdicionales') additionalFilters: string,
  ) {
    const filters: any[] = [{active: true}];
    const additionalFiltersArray: any[] =
      additionalFilters !== undefined ? JSON.parse(additionalFilters) : [];
    if (additionalFilters !== undefined && additionalFilters.length) {
      filters.splice(0, 0, ...additionalFiltersArray);
    }
    filters.splice(0, 0, {active: true});
    let elements: GlobalElement[] = await this.globalElementsRepository.find(
      {
        where: {and: filters},
      },
      {strictObjectIDCoercion: true},
    );
    elements = this.miscTools.sortAndPaginate(
      elements,
      order,
      undefined,
      undefined,
    );
    return jsonata(query).evaluate(elements);
  }

  @get('/global-elements/{id}', {
    responses: {
      '200': {
        description: 'GlobalElement model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(GlobalElement)},
        },
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<GlobalElement> {
    return this.globalElementsRepository.findById(id);
  }

  @patch('/global-elements/{id}', {
    responses: {
      '204': {
        description: 'GlobalElement PATCH success',
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GlobalElement, {partial: true}),
        },
      },
    })
    elementoGlobal: GlobalElement,
  ): Promise<void> {
    await this.globalElementsRepository.updateById(id, elementoGlobal);
  }

  @del('/global-elements/{id}', {
    responses: {
      '204': {
        description: 'GlobalElement DELETE success',
      },
    },
  })
  @authenticate('jwt')
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.globalElementsRepository.deleteById(id);
  }
}
