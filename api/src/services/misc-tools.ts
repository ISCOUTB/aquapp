import {UserRepository} from '../repositories';
import {repository} from '@loopback/repository';
import {UserProfile} from '@loopback/authentication';

export class MiscTools {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  async currentUser(profile: UserProfile) {
    if (profile.name === 'superuser') {
      return {...profile, tipo: 'superuser'};
    }
    return await this.userRepository.findById(profile.id);
  }

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
}
