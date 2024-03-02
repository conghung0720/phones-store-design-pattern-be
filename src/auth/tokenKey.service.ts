import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { TokenKeys } from './models/tokenKey.models';
import { AuthService } from './auth.service';
import { keyTokenPairs } from 'src/utils/keyTokenPairs';
import { UserService } from 'src/user/user.service';
const jwt = require('jsonwebtoken');

@Injectable()
export class TokenKeyService {
  constructor(
    @InjectModel(TokenKeys.name) private tokenKeyModel: Model<TokenKeys>,
    private userService: UserService,
  ) {}

  async handleRefreshToken({ refreshToken, keyStore, user }) {
    const foundRefToken = await this.tokenKeyModel.findOne({
      refreshTokensUsed: { $in: [refreshToken]},
    })

    if (foundRefToken) {
      await this.tokenKeyModel.deleteOne({ user: new Types.ObjectId(user._id) });
      throw new UnauthorizedException('Tài khoản bạn có vấn đề, vui lòng đăng nhập lại');
    }


    const { _id, username } = user;
    const tokens = await keyTokenPairs(
      { user },
      keyStore.publicKey,
      keyStore.privateKey,
    );

    await this.tokenKeyModel.updateOne(
      { user: new Types.ObjectId(_id) },
      {
        $set: {
          refreshToken: tokens.refreshToken,
        },
        $addToSet: {
          refreshTokensUsed: refreshToken,
        },
      },
    );

    return {
      code: 200,
      metadata: {
        user,
        tokens,
      },
    };
  }

  async foundKeyStoreByUserId(userId) {
    return await this.tokenKeyModel.findOne({
      user: new Types.ObjectId(userId),
    });
  }

  async createKeyToken({ idUser, refreshToken, publicKey, privateKey }) {
    const filter = { user: new Types.ObjectId(idUser) },
      update = { publicKey, privateKey, refreshToken },
      option = { upsert: true, new: true };
    const token = await this.tokenKeyModel.findOneAndUpdate(
      filter,
      update,
      option,
    );
    return token ? token.publicKey : null;
  }

  async deleteKeyStoreByUserId({userId}){
    return await this.tokenKeyModel.findOneAndDelete({user: new Types.ObjectId(userId)})
  }
}
