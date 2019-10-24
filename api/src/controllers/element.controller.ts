import {repository} from '@loopback/repository';
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
import {Element} from '../models';
import {ElementRepository, UserRepository} from '../repositories';
import {
  authenticate,
  AuthenticationBindings,
  UserProfile,
} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {MiscTools} from '../services/misc-tools';
import jsonata = require('jsonata');

export class ElementController {
  constructor(
    @repository(ElementRepository)
    public elementsRepository: ElementRepository,
    @inject('MiscTools') public miscTools: MiscTools,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @post('/elements', {
    responses: {
      '200': {
        description: 'Element model instance',
        content: {'application/json': {schema: getModelSchemaRef(Element)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Element, {exclude: ['id']}),
        },
      },
    })
    element: Omit<Element, 'id'>,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUserProfile: UserProfile,
  ): Promise<Element> {
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
    element.user = admin.id;
    element.active = true;
    return this.elementsRepository.create(element);
  }

  @get('/elements/jsonata', {
    responses: {
      '200': {
        description: 'Array of Element model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Element}},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async findJsonata(
    @param.query.string('order') order: string,
    @param.query.boolean('populate') populate: boolean,
    @param.query.string('query')
    query: string,
    @param.query.string('additionalFilters') additionalFilters: string,
    @param.query.number('limit') limit: number,
    @param.query.number('offset') offset: number,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUserProfile: UserProfile,
  ) {
    const admin = await this.miscTools.getAdmin(currentUserProfile.id);
    const currentUser = await this.userRepository.findById(
      currentUserProfile.id,
    );
    await this.miscTools.populateUser(currentUser);
    const currentUserRoleFilters = this.miscTools.validateOperationAndGetFilters(
      'elements',
      'get',
      currentUser,
    );
    const filters: any[] =
      currentUserProfile.name === process.env.ADMIN_USER
        ? [{active: true}]
        : [{active: true}, {user: admin.id}];
    const additionalFiltersArray: any[] =
      additionalFilters !== undefined ? JSON.parse(additionalFilters) : [];
    if (additionalFilters !== undefined && additionalFilters.length) {
      filters.splice(0, 0, ...additionalFiltersArray);
    }
    filters.splice(0, 0, {active: true}, ...currentUserRoleFilters);
    let elements: Element[] = await this.elementsRepository.find(
      {
        where: {and: filters},
        limit,
        offset,
      },
      {strictObjectIDCoercion: true},
    );
    const count = await this.elementsRepository.count(
      {and: filters},
      {strictObjectIDCoercion: true},
    );
    if (populate) {
      for (const element of elements) {
        switch (element.category) {
          case 'sensors':
            element.trackedObject = await this.elementsRepository.findById(
              element.trackedObject,
            );
            element.fieldsToShow = (await this.elementsRepository.findById(
              element.trackedObject.formulario,
            )).campos;
            break;
          case 'tracked-objects':
            element.populatedForm = await this.elementsRepository.findById(
              element.form,
            );
            break;
          default:
            break;
        }
      }
    }
    return {data: jsonata(query).evaluate(elements), total: count.count};
  }

  @get('/elements/{id}', {
    responses: {
      '200': {
        description: 'Element model instance',
        content: {'application/json': {schema: getModelSchemaRef(Element)}},
      },
    },
  })
  @authenticate('jwt')
  async findById(
    @param.path.string('id') id: string,
    @param.query.boolean('populate') populate: boolean,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUserProfile: UserProfile,
  ): Promise<any> {
    const admin = await this.miscTools.getAdmin(currentUserProfile.id);
    const currentUser = await this.userRepository.findById(
      currentUserProfile.id,
    );
    await this.miscTools.populateUser(currentUser);
    this.miscTools.validateOperationAndGetFilters(
      'elements',
      'get',
      currentUser,
    );
    const element = await this.elementsRepository.findById(id);
    if (element.user !== admin.id) {
      throw new HttpErrors.Unauthorized(`Not enough permissions`);
    }
    if (populate) {
      return {
        ...element,
        form: await this.elementsRepository.findById(element.form),
      };
    }
    return element;
  }

  @patch('/elements/{id}', {
    responses: {
      '204': {
        description: 'Element PATCH success',
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Element, {partial: true}),
        },
      },
    })
    elemento: Element,
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
      'patch',
      currentUser,
    );
    const el = await this.elementsRepository.findById(id);
    if (el.user !== admin.id) {
      throw new HttpErrors.Unauthorized(`Not enough permissions`);
    }
    await this.elementsRepository.updateById(id, elemento);
  }

  @del('/elements/{id}', {
    responses: {
      '204': {
        description: 'Element DELETE success',
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
      'delete',
      currentUser,
    );
    const element = await this.elementsRepository.findById(id);
    if (element.user !== admin.id) {
      throw new HttpErrors.Unauthorized(`Not enough permissions`);
    }
    element.active = false;
    await this.elementsRepository.updateById(id, element);
  }
}
