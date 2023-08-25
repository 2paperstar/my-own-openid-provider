import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientRepository } from './client.repository';

@Module({
  providers: [ClientService, ClientRepository],
  exports: [ClientService],
})
export class ClientModule {}
