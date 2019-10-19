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
  put,
  del,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import {User} from '../models';
import {UserRepository, Credentials} from '../repositories';
import {
  authenticate,
  AuthenticationBindings,
  UserProfile,
  TokenService,
  UserService,
} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  UserProfileSchema,
  CredentialsRequestBody,
} from './specs/user-controller.specs';
import {
  PasswordHasherBindings,
  TokenServiceBindings,
  UserServiceBindings,
} from '../keys';
import {PasswordHasher} from '../services/hash.password.bcrypt';
import {MiscTools} from '../services/misc-tools';
import * as jsonata from 'jsonata';

export class UsuarioController {
  constructor(
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,
    @repository(UserRepository) public userRepository: UserRepository,
    @inject('MiscTools') public miscTools: MiscTools,
  ) {}

  @post('/users', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {exclude: ['id']}),
        },
      },
    })
    user: Omit<User, 'id'>,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUserProfile: UserProfile,
  ): Promise<User> {
    user.admin = currentUserProfile.id;
    user.password = await this.passwordHasher.hashPassword(user.password);

    if (currentUserProfile.name === 'superuser') {
      user.tipo = 'admin';
    } else {
      if (user.tipo !== 'admin') {
        throw new HttpErrors.UnprocessableEntity(`Wrong user type`);
      }
    }
    return this.userRepository.create(user);
  }

  @get('/users/count', {
    responses: {
      '200': {
        description: 'User model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async count(
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.query.object('filter', getFilterSchemaFor(User))
    filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @get('/users/jsonata', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': User}},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async findJsonata(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUserProfile: UserProfile,
    @param.query.string('order') order: string,
    @param.query.string('query')
    query: string,
    @param.query.string('additionalFilters') additionalFilters: string,
  ) {
    const filters: any[] = [];
    const additionalFiltersArray: any[] =
      additionalFilters !== undefined ? JSON.parse(additionalFilters) : [];
    if (additionalFilters !== undefined && additionalFilters.length) {
      filters.splice(0, 0, ...additionalFiltersArray);
    }
    const user = (await this.miscTools.currentUser(currentUserProfile)) as User;
    if (user.type === 'admin') {
      filters.splice(
        0,
        0,
        {active: true},
        {administrador: currentUserProfile.id},
      );
    } else if (user.name === 'superuser') {
      filters.splice(0, 0, {active: true}, {type: 'admin'});
    } else {
      throw new HttpErrors.Unauthorized(`You don't have enough permissions`);
    }
    let users: User[] = await this.userRepository.find(
      {
        where: {and: filters},
      },
      {strictObjectIDCoercion: true},
    );
    users = this.miscTools.sortAndPaginate(users, order, undefined, undefined);
    const usuariosMapeados = users.map(e => ({usuario: e}));
    return jsonata(query).evaluate(usuariosMapeados);
  }

  @get('/users/{id}', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  @authenticate('jwt')
  async findById(@param.path.string('id') id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    delete user.password;
    return user;
  }

  @patch('/users/{id}', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @del('/users/{id}', {
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  @authenticate('jwt')
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }

  @get('/users/me', {
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: UserProfileSchema,
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async printCurrentUser(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUserProfile: UserProfile,
  ): Promise<UserProfile> {
    return currentUserProfile;
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string; user: any}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);

    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);
    if (user.password === undefined) {
      delete user.password;
    }
    return {token, user};
  }
}
