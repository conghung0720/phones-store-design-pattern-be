import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';
import { CartModule } from 'src/cart/cart.module';
import { OrderHistoryModule } from 'src/order-history/order-history.module';
import { OrderdetailModule } from 'src/orderdetail/orderdetail.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [UserModule, EmailModule, ProductModule, CartModule, OrderdetailModule],
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}
