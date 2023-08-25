import { Controller, Get, Render, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Get('login')
  @Render('auth/login')
  loginPage() {
    return { sample: this.userService.getRandomUser() };
  }

  @Get('info')
  @Render('auth/info')
  info(@Res() res: Response) {
    if (true) {
      res.status(302).redirect('/auth/login');
    }
    return { user: UserEntity.randomWithId(0) };
  }
}
