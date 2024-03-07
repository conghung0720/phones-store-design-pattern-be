import { Module } from '@nestjs/common';
import { OrderDetailService } from './orderdetail.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderDetailSchema } from './schemas/OrderDetail.schema';
import { OrderdetailController } from './orderdetail.controller';
import { VoucherModule } from 'src/voucher/voucher.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'orderDetail', schema: OrderDetailSchema },
    ]),
    VoucherModule
  ],
  controllers: [OrderdetailController],
  providers: [OrderDetailService],
  exports: [OrderDetailService]
})
export class OrderdetailModule { }
