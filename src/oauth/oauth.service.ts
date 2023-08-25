import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { UserEntity } from 'src/user/entities/user.entity';
import { ClientEntity } from 'src/client/entities/client.entity';
import { TokenDto } from './dto/token.dto';
import { ClientService } from 'src/client/client.service';

interface CacheData {
  user: UserEntity;
  client: ClientEntity;
  redirectUri: string;
  nonce?: string;
  scopes?: readonly string[];
}

@Injectable()
export class OauthService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly clientService: ClientService,
  ) {}

  generateCode(data: CacheData) {
    const code = this.generateOpaqueToken();
    this.cacheManager.set(code, data, 3600e3);
    return code;
  }

  private generateOpaqueToken(): string {
    return crypto
      .randomBytes(32)
      .toString('base64')
      .replace(/[+\/=]/g, '');
  }

  async generateToken(tokenDto: TokenDto) {
    const client = this.clientService.getClientByIdAndSecret(
      tokenDto.client_id,
      tokenDto.client_secret,
    );
    if (!client) {
      throw new BadRequestException('unauthorized_client');
    }

    if (tokenDto.grant_type !== 'authorization_code') {
      throw new BadRequestException('unsupported_grant_type');
    }
    if (!tokenDto.code) {
      throw new BadRequestException('invalid_request');
    }

    const data = await this.cacheManager.get<CacheData>(tokenDto.code);
    if (!data) {
      throw new BadRequestException('invalid_grant');
    }
    this.cacheManager.del(tokenDto.code);

    if (data.redirectUri !== tokenDto.redirect_uri) {
      throw new BadRequestException('invalid_grant');
    }
    if (data.client.id !== client.id) {
      throw new BadRequestException('invalid_client');
    }

    return this.createToken(data);
  }

  private async createToken(data: CacheData) {
    const accessToken = this.generateOpaqueToken();
    await this.cacheManager.set(accessToken, data, 3600e3);
    const refreshToken = this.generateOpaqueToken();
    await this.cacheManager.set(refreshToken, data, 3600e3 * 24 * 30 * 6);
    const expiresIn = 3600;
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn,
      token_type: 'Bearer',
      scope: data.scopes?.join(' ') || '',
    };
  }
}
