import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Render,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Get('login')
  @Render('auth/login')
  loginPage() {
    return { sample: this.userService.getRandomUser() };
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    const user = this.userService.getUserByUsernameAndPassword(
      loginDto.username,
      loginDto.password,
    );
    if (!user) throw new NotFoundException();
    return user;
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
