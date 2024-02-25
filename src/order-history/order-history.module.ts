import { Module } from '@nestjs/common';
import { OrderHistoryService } from './order-history.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderHistorySchema } from './schemas/order-history.schema';
import { OrderHistoryController } from './order-history.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'orderHistory', schema: OrderHistorySchema },
    ]),
  ],
  providers: [OrderHistoryService],
  exports: [OrderHistoryService],
  controllers: [OrderHistoryController],
})
export class OrderHistoryModule {}
