import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  UseGuards,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { keyTokenPairs } from 'src/utils/keyTokenPairs';
import { TokenKeyService } from './tokenKey.service';
import { UserService } from 'src/user/user.service';
import { UserDecorator } from 'src/user/Decorator/User.decorator';
import { Roles } from 'src/constants';
import { CartService } from 'src/cart/cart.service';
import crypto, { randomUUID } from 'node:crypto'
import { UserLoginDto } from './dto/sign-in.dto';


@Injectable()
export class AuthService {
  constructor(
    // private cartService: CartService,
    @InjectModel(User.name) private userModel: Model<User>,
    private tokenKeyService: TokenKeyService,
    private userService: UserService,
    private cartService: CartService
  ) {}
  async signUp({ username, password, email, refreshToken = null }) {
    const holderUsername = await this.userModel.findOne({ username });
    if (holderUsername) {
      throw new ConflictException('Tài khoản đã tồn tại!');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newAccount = await this.userModel.create({
      username,
      password: hashPassword,
      email,
      active: true,
      role: Roles.Admin
    });
    if (newAccount) {
      const publicKey = randomUUID().toString();
      const privateKey = randomUUID().toString();

      const tokens = await keyTokenPairs({ newAccount }, publicKey, privateKey);

      const keyStore = this.tokenKeyService.createKeyToken({
        idUser: newAccount._id,
        refreshToken: tokens.refreshToken,
        publicKey,
        privateKey,
      });

      if (!keyStore) throw new ConflictException('KeyStore not save');

      await this.cartService.newUserCartAndUpdateItem({ 
        userId: newAccount._id.toString(), product: {} })

      return {
        code: 200,
        metadata: {
          user: newAccount,
          tokens,
        },
      };
    }
    throw new ConflictException('Not create account');
  }

  async signIn({ username, password } : UserLoginDto) {
    const user = await this.userService.findByUsername(username);
    if (!user) throw new ForbiddenException('Tài khoản không tồn tại');

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) throw new ForbiddenException('Tên tài khoản của bạn hoặc Mật khẩu không đúng, vui lòng thử lại');

    const privateKey = await randomUUID().toString();
    const publicKey = await randomUUID().toString();

    const tokens = await keyTokenPairs({ user }, publicKey, privateKey);
    const keyStore = await this.tokenKeyService.createKeyToken({
      idUser: user._id,
      refreshToken: tokens.refreshToken,
      publicKey,
      privateKey,
    });
    if (!keyStore) throw new ConflictException('Lỗi khi lưu keystore');

    return {
      code: 200,
      metadata: {
        user,
        tokens,
      },
    };
  }

  async logout({userId}){
      return await this.tokenKeyService.deleteKeyStoreByUserId({userId});
  }
}
