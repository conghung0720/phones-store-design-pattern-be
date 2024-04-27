import { StatusOrderEnum } from 'src/constants';
import { DataOrderStatus, OrderStateHandler } from '../dto/OrderDetail.dto';
import { OrderdetailService } from '../orderdetail.service';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GettingItemStatus implements OrderStateHandler {
  constructor(@Inject(OrderdetailService) private orderdetailService?: OrderdetailService) {
    //not read orderdetailService, fix for me
  }

  async handle({
    userId,
    orderId,
  }: DataOrderStatus) : Promise<void> {
    console.log("🚀 ~ GettingItemStatus ~ orderId2:", orderId)
    //ERROR [ExceptionsHandler] Cannot read properties of undefined (reading 'changeStatusOrderDetail')
    //fix for me cannot read properties of undefined
    
    await this.orderdetailService.changeStatusOrderDetail({
      userId,
      orderDetailId: orderId,
      status: StatusOrderEnum.GETTING_ITEM ,
    });
  }
}
