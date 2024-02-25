import {
  BadRequestException,
  Inject,
  Injectable,
  Module,
  UnauthorizedException,
} from '@nestjs/common';
import { HEADERS_METADATA } from '@nestjs/common/constants';
import { InjectModel } from '@nestjs/mongoose';
import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { TokenKeyService } from 'src/auth/tokenKey.service';
import { User } from 'src/user/schemas/user.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
})
@Injectable()
export class AuthUtils {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async CheckAuth(req: Request, res: Response, next: NextFunction) {
    const userId = req.get('CLIENT_ID');
    if (!userId) throw new UnauthorizedException('Lỗi không tìm thấy userId');

    // const foundKey = this
  }
}
