import { Controller, Get, Render } from '@nestjs/common';

@Controller('oauth')
export class OauthController {
  @Get('authorize')
  @Render('oauth/authorize')
  authorize() {
    return {};
  }
}
