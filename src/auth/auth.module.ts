import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { TokenKeySchema, TokenKeys } from './models/tokenKey.models';
import { TokenKeyService } from './tokenKey.service';
import { UserService } from 'src/user/user.service';
import { CartModule } from 'src/cart/cart.module';
import { CartService } from 'src/cart/cart.service';
import { GoogleStrategy } from './google.strategy';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: TokenKeys.name, schema: TokenKeySchema },
    ]),
    CartModule
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenKeyService, UserService, GoogleStrategy, ],
  exports: [TokenKeyService],
})
export class AuthModule {
  constructor(private authSerivce: AuthService) {}
}
