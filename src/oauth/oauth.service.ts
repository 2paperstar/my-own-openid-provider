import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { UserEntity } from 'src/user/entities/user.entity';
import { ClientEntity } from 'src/client/entities/client.entity';

@Injectable()
export class OauthService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  generateCode(user: UserEntity, client: ClientEntity, redirectUri: string) {
    const code = this.generateOpaqueToken();
    this.cacheManager.set(code, { user, client, redirectUri }, 3600e3);
    return code;
  }

  private generateOpaqueToken(): string {
    return crypto
      .randomBytes(32)
      .toString('base64')
      .replace(/[+\/=]/g, '');
  }
}
