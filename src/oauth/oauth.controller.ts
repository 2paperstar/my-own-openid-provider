import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  Session,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthorizeDto } from './dto/authorize.dto';
import { ClientService } from 'src/client/client.service';
import { OauthService } from './oauth.service';
import { TokenDto } from './dto/token.dto';

@Controller('oauth')
export class OauthController {
  constructor(
    private readonly clientService: ClientService,
    private readonly oauthService: OauthService,
  ) {}

  @Get('authorize')
  authorize(
    @Query() authorizeDto: AuthorizeDto,
    @Session() session: Record<string, any>,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const client = this.clientService.getClientById(authorizeDto.client_id);
    if (!client) {
      throw new BadRequestException('invalid_client');
    }
    const user = session.user;
    if (!user) {
      return res
        .status(302)
        .redirect(`/auth/login?redirect=${encodeURIComponent(req.url)}`);
    }
    if (!client.redirectUris.includes(authorizeDto.redirect_uri)) {
      throw new BadRequestException('unauthorized_client');
    }
    const params = new URLSearchParams();
    params.set(
      'code',
      this.oauthService.generateCode({
        user,
        client,
        redirectUri: authorizeDto.redirect_uri,
        nonce: authorizeDto.nonce,
        scopes: authorizeDto.scope,
      }),
    );
    if (authorizeDto.state) {
      params.set('state', authorizeDto.state);
    }
    return res
      .status(302)
      .redirect(`${authorizeDto.redirect_uri}?${params.toString()}`);
  }

  @Post('token')
  token(@Body() tokenDto: TokenDto) {
    return this.oauthService.generateToken(tokenDto);
  }
}
