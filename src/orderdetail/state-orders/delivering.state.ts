import { StatusOrderEnum } from 'src/constants';
import { DataOrderStatus, OrderStateHandler } from '../dto/OrderDetail.dto';
import { OrderdetailService } from '../orderdetail.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeliveringStatus implements OrderStateHandler {
  constructor(private orderdetailService?: OrderdetailService) {}

  async handle({ userId, orderId }: DataOrderStatus): Promise<void> {
    
    await this.orderdetailService.changeStatusOrderDetail({
      userId,
      orderDetailId: orderId,
      status: StatusOrderEnum.DELIVERING,
    });
  }
}
