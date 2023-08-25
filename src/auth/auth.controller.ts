import { Controller, Get, Render } from '@nestjs/common';
import { UserEntity } from 'src/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  @Get('info')
  @Render('auth/info')
  info() {
    return { user: UserEntity.randomWithId(0) };
  }
}
