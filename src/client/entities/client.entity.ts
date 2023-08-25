import { faker } from '@faker-js/faker';
import * as crypto from 'crypto';

export class ClientEntity {
  id: string;
  secret: string;

  static random() {
    const client = new ClientEntity();
    client.id = crypto.randomBytes(16).toString('hex');
    client.secret = faker.internet.password({ length: 64 });
    return client;
  }
}
