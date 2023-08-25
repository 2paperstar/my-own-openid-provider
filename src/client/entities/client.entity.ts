import { faker } from '@faker-js/faker';
import * as crypto from 'crypto';

export class ClientEntity {
  id: string;
  secret: string;
  redirectUris: string[];

  static random() {
    const client = new ClientEntity();
    client.id = crypto.randomBytes(16).toString('hex');
    client.secret = faker.internet.password({ length: 64 });
    client.redirectUris = [faker.internet.url()];
    return client;
  }
}
