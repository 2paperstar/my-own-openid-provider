import { Injectable } from '@nestjs/common';
import { ClientRepository } from './client.repository';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {
    const client = clientRepository.getRandomClient();
    console.log(
      `http://localhost:3000/oauth/authorize?` +
        `redirect_uri=${client.redirectUris[0]}&scope=openid&response_type=code&client_id=${client.id}`,
    );
    console.log(
      `http://localhost:3000/oauth/token?` +
        `grant_type=authorization_code&code=CODE&redirect_uri=${client.redirectUris[0]}&client_id=${client.id}&client_secret=${client.secret}`,
    );
  }

  getClientById(id: string) {
    return this.clientRepository.getClientById(id);
  }

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
