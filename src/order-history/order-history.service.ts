import { BadRequestException, Injectable, Type } from '@nestjs/common';
import { OrderHistoryDto } from './dto/order-history.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OrderHistory } from './schemas/order-history.schema';

@Injectable()
export class OrderHistoryService {
  constructor(
    @InjectModel('orderHistory')
    private orderHistoryModel = Model<OrderHistory>,
  ) { }

  async create(orderHistory: OrderHistoryDto) {
    const newOrderHistory = await this.orderHistoryModel.create(orderHistory);
    if (!newOrderHistory) throw new BadRequestException('Lỗi tạo mới đơn hàng');
    return newOrderHistory;
  }

  async getByUserId({ userId }) {
    return await this.orderHistoryModel.find({ userId: userId.id });
  }
}
