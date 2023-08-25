import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Res,
  Session,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthorizeDto } from './dto/authorize.dto';
import { ClientService } from 'src/client/client.service';

@Controller('oauth')
export class OauthController {
  constructor(private readonly clientService: ClientService) {}

  @Get('authorize')
  authorize(
    @Query() authorizeDto: AuthorizeDto,
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    const client = this.clientService.getClientById(authorizeDto.client_id);
    if (!client) {
      throw new BadRequestException('invalid_client');
    }
    const user = session.user;
    if (!user) {
      return res.status(302).redirect('/auth/login');
    }
    return res.json({ authorizeDto });
  }
}
