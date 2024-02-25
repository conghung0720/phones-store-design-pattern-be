import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { TokenKeyService } from './auth/tokenKey.service';
import { ProductModule } from './product/product.module';
import { BrandModule } from './brand/brand.module';
import { CartService } from './cart/cart.service';
import { CartModule } from './cart/cart.module';

import { CheckoutModule } from './checkout/checkout.module';
import { OrderHistoryModule } from './order-history/order-history.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { OrderdetailController } from './orderdetail/orderdetail.controller';
import { OrderdetailModule } from './orderdetail/orderdetail.module';
import { Cart } from './cart/schemas/cart.schema';
import { VoucherModule } from './voucher/voucher.module';
import { EmailService } from './email/email.service';
import { ChatgptModule } from './chatgpt/chatgpt.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    MongooseModule.forRoot(process.env.DB_LOCAL),
    AuthModule,
    UserModule,
    ProductModule,
    BrandModule,
    CheckoutModule,
    CartModule,
    OrderHistoryModule,
    OrderdetailModule,
    VoucherModule,
    ChatgptModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    EmailService,
    
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude('auth').forRoutes('user', 'cart', 'orderdetail');
  }
}
