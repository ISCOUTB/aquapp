import {UserRepository, ElementRepository} from '../repositories';
import {repository} from '@loopback/repository';
import {User} from '../models';
import {HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/authentication';
import fetch from 'node-fetch';

export class MiscTools {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(ElementRepository)
    public elementsRepository: ElementRepository,
  ) {}

  sortAndPaginate(
    object: any[],
    order: string,
    limit?: number | undefined,
    offset?: number | undefined,
  ) {
    if (order !== undefined && order !== '[]' && order !== '{}') {
      const collator = new Intl.Collator('es', {
        numeric: true,
        sensitivity: 'base',
      });
      const appliedOrder = JSON.parse(order)[0];
      if (appliedOrder.direction === 'asc') {
        object.sort(function(a: any, b: any) {
          let propA = `${a[appliedOrder.field]}`,
            propB = `${b[appliedOrder.field]}`;
          return collator.compare(propA, propB);
        });
      } else {
        object.sort(function(a: any, b: any) {
          let propA = `${a[appliedOrder.field]}`,
            propB = `${b[appliedOrder.field]}`;
          return collator.compare(propB, propA);
        });
      }
    }

    if (limit !== undefined && offset !== undefined) {
      object = object.slice(offset, offset + limit);
    }

    return object;
  }

  sortByKey(object: any[], key: string, direction = 'asc') {
    const collator = new Intl.Collator('es', {
      numeric: true,
      sensitivity: 'base',
    });
    if (direction === 'asc') {
      object.sort(function(a: any, b: any) {
        let propA = `${a[key]}`,
          propB = `${b[key]}`;
        return collator.compare(propA, propB);
      });
    } else {
      object.sort(function(a: any, b: any) {
        let propA = `${a[key]}`,
          propB = `${b[key]}`;
        return collator.compare(propB, propA);
      });
    }
  }

  async addDefaultFilters(
    usuario: string,
    filtro?: any,
    userProperty: string = 'user',
  ) {
    const userInDb = await this.userRepository.findById(usuario);
    const userFilter: any = {};
    userFilter[userProperty] =
      userInDb.tipo === 'admin' ? usuario : userInDb.admin;
    const filtrosAdicionales: any = [];
    if (filtro === undefined) {
      const filtro = {
        where: {
          and: [userFilter, {active: true}, ...filtrosAdicionales],
        },
      };
      return filtro;
    } else {
      if (Object.keys(filtro.where).indexOf('and') !== -1) {
        filtro.where.and.push(userFilter, {active: true});
        return filtro;
      }
    }
  }

  gmtM5(timestamp: number) {
    let date = new Date(timestamp);
    let offset = date.getTimezoneOffset() * 60000;
    let UTCDate = date.getTime() + offset;
    let GMTM5Date = UTCDate + 3600000 * -5;
    let newDate = new Date(GMTM5Date);
    return newDate.getTime();
  }

  async getAdmin(authenticatedUserId: string) {
    const userInDb = await this.userRepository.findById(authenticatedUserId);
    if (userInDb.type === 'admin') {
      return userInDb;
    } else {
      return await this.userRepository.findById(userInDb.admin);
    }
  }

  async populateUser(user: User) {
    if (user.type === 'admin') {
      return;
    }
    for (let i = 0; i < user.roles.length; i++) {
      user.roles[i] = await this.elementsRepository.findById(user.roles[i]);
    }
  }

  validateOperationAndGetFilters(
    collection: string,
    operation: 'get' | 'delete' | 'patch' | 'post',
    user: User,
  ) {
    const operationToPermission = {
      post: 'create',
      get: 'read',
      patch: 'update',
      delete: 'delete',
    };
    if (user.type === 'admin') {
      return [];
    }
    const filters: any = [];
    let enoughPermissions = false;
    for (const role of user.roles) {
      const condition =
        role.collection === collection &&
        role[operationToPermission[operation]];
      if (condition) {
        enoughPermissions = true;
        console.log(JSON.stringify(role.conditions));
        if (role.conditions && role.conditions.length) {
          filters.push({and: role.conditions.map((c: any) => c.query)});
        }
      }
    }
    if (!enoughPermissions) {
      throw new HttpErrors.Unauthorized(`Not enough permissions`);
    }
    return [{or: filters}];
  }

  async currentUser(profile: UserProfile) {
    if (profile.name === 'superuser') {
      return {...profile, tipo: 'superuser'};
    }
    return await this.userRepository.findById(profile.id);
  }

  async icampff(datum: any) {
    return await fetch(
      `http://buritaca.invemar.org.co/ICAMWebService/calculate-icam-ae/od/${datum.dissolvedOxygen}/no3/${datum.nitrate}/sst/${datum.totalSuspendedSolids}/ctt/${datum.thermotolerantColiforms}/ph/${datum.pH}/po4/${datum.phosphates}/dbo/${datum.biochemicalOxygenDemand}/cla/${datum.chrolophyllA}`,
      {
        method: 'GET',
      },
    )
      .then(async response => (await response.json()).value)
      .catch(() => {
        throw new HttpErrors.ServiceUnavailable(`Invemar API is down`);
      });
  }
}
