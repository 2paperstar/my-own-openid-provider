import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  Res,
  Session,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Get('login')
  loginPage(@Session() session: Record<string, any>, @Res() res: Response) {
    if (session.user) {
      return res.status(302).redirect('/auth/info');
    }
    return res.render('auth/login', {});
  }

  @Post('login')
  login(
    @Session() session: Record<string, any>,
    @Body() loginDto: LoginDto,
    @Res() res: Response,
    @Query('redirect') redirect?: string,
  ) {
    const user = this.userService.getUserByUsernameAndPassword(
      loginDto.username,
      loginDto.password,
    );
    if (!user) throw new NotFoundException();
    session.user = user;
    return res.status(302).redirect(redirect ?? '/auth/info');
  }

  @Get('info')
  info(@Session() session: Record<string, any>, @Res() res: Response) {
    const user = session.user;
    if (!user) {
      return res.status(302).redirect('/auth/login');
    }
    return res.render('auth/info', { user });
  }
}
