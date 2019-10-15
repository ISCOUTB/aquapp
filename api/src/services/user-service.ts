import {UserService, UserProfile} from '@loopback/authentication';

import {User} from '../models';

import {repository} from '@loopback/repository';

import {inject} from '@loopback/core';

import {PasswordHasherBindings} from '../keys';

import {HttpErrors} from '@loopback/rest';
import {UserRepository, Credentials} from '../repositories';
import {PasswordHasher} from './hash.password.bcrypt';

export class MyUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<User> {
    if (
      credentials.email === process.env.ADMIN_EMAIL &&
      credentials.password === process.env.ADMIN_PASS
    ) {
      const usuario: User = new User();
      usuario.name = 'superuser';
      usuario.id = '';
      usuario.email = credentials.email;
      return usuario;
    }

    const foundUser = await this.userRepository.findOne({
      where: {email: credentials.email},
    });

    if (!foundUser) {
      throw new HttpErrors.NotFound(
        `User with email ${credentials.email} not found.`,
      );
    }
    const passwordMatched = await this.passwordHasher.comparePassword(
      credentials.password,
      foundUser.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized('The credentials are not correct.');
    }

    return foundUser;
  }

  convertToUserProfile(user: User): UserProfile {
    return {id: user.id!, name: user.name};
  }
}
