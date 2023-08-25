import { Module } from '@nestjs/common';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';
import { ClientModule } from 'src/client/client.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, ClientModule],
  controllers: [OauthController],
  providers: [OauthService],
})
export class OauthModule {}
