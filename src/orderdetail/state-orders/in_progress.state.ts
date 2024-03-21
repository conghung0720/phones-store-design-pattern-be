import { StatusOrderEnum } from 'src/constants';
import { DataOrderStatus, OrderStateHandler } from '../dto/OrderDetail.dto';
import { OrderdetailService } from '../orderdetail.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InProgressStatus implements OrderStateHandler {
  constructor(private orderdetailService?: OrderdetailService) {}

  async handle({
    userId,
    orderId,
  }: DataOrderStatus) : Promise<void> {
    this.orderdetailService.changeStatusOrderDetail({
      userId,
      orderDetailId: orderId,
      status: StatusOrderEnum.IN_PROGRESS ,
    });
  }
}
