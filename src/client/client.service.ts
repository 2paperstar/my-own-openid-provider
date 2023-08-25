import { Injectable } from '@nestjs/common';
import { ClientRepository } from './client.repository';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  getClientByIdAndSecret(id: string, secret: string) {
    const client = this.clientRepository.getClientById(id);
    if (client && client.secret === secret) {
      return client;
    }
    return null;
  }

  getRandomClient() {
    return this.clientRepository.getRandomClient();
  }
}
