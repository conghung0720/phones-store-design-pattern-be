import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserDecorator } from 'src/user/Decorator/User.decorator';
import { OrderdetailService } from './orderdetail.service';
import { Status } from 'src/constants';

@Controller('orderDetail')
export class OrderdetailController {
    constructor(private orderDetailService: OrderdetailService){}

    @Get('history')
    async orderHistory(@UserDecorator() user) {
      return this.orderDetailService.findOrderHistoryByUserId({ userId: user._id });
    }

    @Get('getAll')
    async getAllOrderHistory(){
        return await this.orderDetailService.findAllOrderHistory()
    }

    @Get(':orderId')
    async findOrderDetail(@Param('orderId') orderId) {
      return await this.orderDetailService.findOrderDetailById({orderId});
    }

    @Post('getting_item')
    async gettingItemOrder(@UserDecorator() user, @Body() orderDetail){
        return await this.orderDetailService.changeStatusOrderDetail
        ({userId: orderDetail.userId, orderDetailId: orderDetail._id, status: Status.GETTING_ITEM})
    }

    @Post('completed')
    async completedOrderDetail(@UserDecorator() user, @Body() orderDetail){
        return await this.orderDetailService.changeStatusOrderDetail
        ({userId: orderDetail.userId, orderDetailId: orderDetail._id, status: Status.COMPLETED})
    }

    @Post('packaging')
    async packagingOrderDetail(@UserDecorator() user, @Body() orderDetail){
        return await this.orderDetailService.changeStatusOrderDetail
        ({userId: orderDetail.userId, orderDetailId: orderDetail._id, status: Status.PACKAGING})
    }

    @Post('delivering')
    async devliveryOrderDetail(@UserDecorator() user, @Body() orderDetail){
        return await this.orderDetailService.changeStatusOrderDetail
        ({userId: orderDetail.userId, orderDetailId: orderDetail._id, status: Status.DELIVERING})
    }

    @Post('cancel')
    async cancelOrderDetail(@UserDecorator() user, @Body() orderDetail){
        return await this.orderDetailService.changeStatusOrderDetail
        ({userId: orderDetail.userId, orderDetailId: orderDetail._id, status: Status.CANCELED})
    }
}
