import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  Module,
  Header,
  Headers,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { HEADER } from 'src/constants';
import { TokenKeyService } from 'src/auth/tokenKey.service';
import { AuthModule } from 'src/auth/auth.module';
import { Types } from 'mongoose';
const jwt = require('jsonwebtoken');

@Module({
  imports: [AuthModule],
})
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private userService: UserService,
    private keyStoreService: TokenKeyService,
  ) {}

  async use(req, res: Response, next: NextFunction) {
    //header: client_id, accessToken, refreshToken
    const userId = req.get(HEADER.CLIENT_ID);
    const foundUserId = await this.userService.findByUserId(userId);
    if (!foundUserId) throw new ForbiddenException('Không tìm thấy userId');


    const keyStore = await this.keyStoreService.foundKeyStoreByUserId(userId);
    if (!keyStore) throw new ForbiddenException('Không tìm thấy keystore');

    const refreshToken = req.get(HEADER.REFRESHTOKEN);
    
    if (refreshToken && req.url === "/handleRefreshToken") {
      try {
        const decoded = await jwt.verify(refreshToken, keyStore.publicKey);
        if(!decoded) throw new ForbiddenException("Invalid JWT")
        if (decoded.user._id !== userId)
          throw new ForbiddenException('Lỗi không trùng id');

        req.keyStore = keyStore;
        req.refreshToken = refreshToken;
        req.user = decoded.user;
        return next();
      } catch (error) {
        throw new Error(error)
      }
    }

    try{
      const accessToken = req.get(HEADER.AUTHORIZATION);
      const decoded = await jwt.verify(accessToken, keyStore.privateKey)
      if(!decoded) throw new ForbiddenException('Het han token');
      req.user = decoded.user
      return next();
    }
    catch(error) {
      throw new ForbiddenException('jwt expired')
    }
    } 
     
    
  
}
