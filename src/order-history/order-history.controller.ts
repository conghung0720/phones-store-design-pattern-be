import { Controller, Get, Param } from '@nestjs/common';
import { OrderHistoryService } from './order-history.service';

@Controller('order-history')
export class OrderHistoryController {
  constructor(private orderHistoryService: OrderHistoryService) {}

  @Get(':id')
  async orderHistory(@Param() id) {
    return this.orderHistoryService.findOrderHistoryByUserId({ userId: id });
  }
}
