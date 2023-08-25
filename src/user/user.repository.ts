import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { faker } from '@faker-js/faker';

const users = [...Array(20)].map(
  (_, id) =>
    new UserEntity({
      id,
      username: faker.internet.userName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    }),
);

@Injectable()
export class UserRepository {
  getUserByUsername(username: string) {
    return users.find((user) => user.username === username);
  }
}
