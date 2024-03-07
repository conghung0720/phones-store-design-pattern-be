import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { TokenKeyService } from 'src/auth/tokenKey.service';
import { KeyStore } from 'src/auth/decorator/KeyStore.decorator';
import { UserDecorator } from './Decorator/User.decorator';
import { RefreshToken } from 'src/auth/decorator/RefreshToken.decorator';
import { Types } from 'mongoose';

@Controller('user')
export class UserController {
  constructor(private userService: UserService, private tokenService: TokenKeyService) { }

  @Get('profileById/:id')
  async getById(@Param('id') id) {
    return await this.userService.getById(id);
  }

  @Get('profile')
  async findProfile(@UserDecorator() user) {
    return await this.userService.getById(new Types.ObjectId(user._id))
  }

  @Get('')
  async getAll() {
    return await this.userService.getAll();
  }

  @Post('handleRefreshToken')
  async handleRefreshToken(@KeyStore() keyStore, @UserDecorator() user, @RefreshToken() refreshToken) {
    return await this.tokenService.handleRefreshToken({
      refreshToken,
      user,
      keyStore
    });
  }
  @Post('')
  async create(@Body() user: UserDto) { }

  @Post('edit')
  async edit(@Body() user) {
    return await this.userService.changeProfileUser({ user })
  }
}
