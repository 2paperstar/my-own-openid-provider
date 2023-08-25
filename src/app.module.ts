import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OauthModule } from './oauth/oauth.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [OauthModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
