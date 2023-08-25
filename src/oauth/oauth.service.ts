import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
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
  private readonly jwtPrivateKey: crypto.KeyObject;
  private readonly jwtPublicKey: crypto.KeyObject;
  private readonly jwtKeyID: string;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly clientService: ClientService,
  ) {
    const key = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });
    this.jwtPrivateKey = crypto.createPrivateKey(key.privateKey);
    this.jwtPublicKey = crypto.createPublicKey(key.publicKey);
    const hash = crypto.createHash('sha256');
    hash.update(this.jwtPublicKey.export({ type: 'spki', format: 'der' }));
    this.jwtKeyID = hash.digest('hex');
  }

  private cert() {
    return {
      ...this.jwtPrivateKey.export({ format: 'jwk' }),
      kid: this.jwtKeyID,
      use: 'sig',
      alg: 'RS256',
    };
  }

  certs() {
    return { keys: [this.cert()] };
  }

  discovery() {
    const baseUrl = 'http://localhost:3000';
    return {
      issuer: 'http://localhost:3000',
      authorization_endpoint: `${baseUrl}/oauth/authorize`,
      token_endpoint: `${baseUrl}/oauth/token`,
      userinfo_endpoint: `${baseUrl}/oauth/userinfo`,
      jwks_uri: `${baseUrl}/oauth/certs`,
      response_types_supported: [
        'code',
        'token',
        'id_token',
        'code token',
        'code id_token',
        'token id_token',
        'code token id_token',
      ],
      subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: ['RS256'],
      scopes_supported: ['openid'],
      token_endpoint_auth_methods_supported: [
        'client_secret_basic',
        'client_secret_post',
      ],
      claims_supported: ['name', 'email', 'aud', 'exp', 'iat', 'iss', 'sub'],
      grant_types_supported: [
        'authorization_code',
        'refresh_token',
        'implicit',
      ],
    };
  }

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
    const idToken = jwt.sign(
      {
        nonce: data.nonce,
        name: `${data.user.firstName} ${data.user.lastName}`,
        email: data.user.email,
      },
      this.jwtPrivateKey,
      {
        algorithm: 'RS256',
        expiresIn,
        audience: data.client.id,
        issuer: 'http://localhost:3000',
        subject: data.user.id.toString(),
        keyid: this.jwtKeyID,
      },
    );
    return {
      id_token: idToken,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn,
      token_type: 'Bearer',
      scope: data.scopes?.join(' ') || '',
    };
  }
}
