import { faker } from '@faker-js/faker';

export class UserEntity {
  id: number;
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;

  static randomWithId(id: number) {
    const user = new UserEntity();
    user.id = id;
    user.username = faker.internet.userName();
    user.password = faker.internet.password();
    user.email = faker.internet.email();
    user.firstName = faker.person.firstName();
    user.lastName = faker.person.lastName();
    return user;
  }
}
