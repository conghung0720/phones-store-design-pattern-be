import { StatusOrderEnum } from 'src/constants';
import { DataOrderStatus, OrderStateHandler } from '../dto/OrderDetail.dto';
import { OrderdetailService } from '../orderdetail.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CompletedItemStatus implements OrderStateHandler {
  constructor(private orderdetailService?: OrderdetailService) {
  }

  public async handle({ userId, orderId }: DataOrderStatus): Promise<void> {
    this.orderdetailService.changeStatusOrderDetail({
      userId,
      orderDetailId: orderId,
      status: StatusOrderEnum.COMPLETED,
    });
  }
}
