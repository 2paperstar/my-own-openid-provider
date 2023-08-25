import { Module } from '@nestjs/common';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';
import { ClientModule } from 'src/client/client.module';
import { UserModule } from 'src/user/user.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [UserModule, ClientModule, CacheModule.register()],
  controllers: [OauthController],
  providers: [OauthService],
})
export class OauthModule {}
