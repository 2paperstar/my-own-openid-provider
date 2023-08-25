import { Injectable } from '@nestjs/common';
import { ClientEntity } from './entities/client.entity';

const clients = [...Array(20)].map(() => ClientEntity.random());

@Injectable()
export class ClientRepository {
  getClientById(id: string) {
    return clients.find((client) => client.id === id);
  }

  getRandomClient() {
    return clients[Math.floor(Math.random() * clients.length)];
  }
}
