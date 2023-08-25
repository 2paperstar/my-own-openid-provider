import { faker } from '@faker-js/faker';
import crypto from 'crypto';

export class ClientEntity {
  id: string;
  secret: string;

  static random() {
    const client = new ClientEntity();
    client.id = crypto.randomBytes(64).toString('hex');
    client.secret = faker.internet.password({ length: 64 });
    return client;
  }
}
