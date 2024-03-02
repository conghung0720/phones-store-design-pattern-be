import { Body, Controller, Post, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/user/dto/user.dto';
import { Request } from 'express';
import { HEADER } from 'src/constants';
import { AuthGuard } from '@nestjs/passport/dist';
import { TokenKeyService } from './tokenKey.service';
import { UserDecorator } from 'src/user/Decorator/User.decorator';
import { UserLoginDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenKeyService,
  ) {}

  @Post('signup')
  async signUp(@Body() userDto: UserDto) {
    // console.log(ủe);
    return await this.authService.signUp(userDto);
  }

  @Post('signin')
  async signIn(@Body() userLoginDto: UserLoginDto) {
    return await this.authService.signIn(userLoginDto);
  }

  @Post('logout')
  async logout(@UserDecorator() user) {
    return await this.authService.logout({userId: user._id})
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req){
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req, @Res() res){
    console.log(req.user);
    return res.redirect('http://localhost:3000/');
  }
}
