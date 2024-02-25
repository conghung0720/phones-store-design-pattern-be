import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { OrderDetailDto } from './dto/OrderDetail.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OrderDetail } from './schemas/OrderDetail.schema';
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { Status } from 'src/constants';

@Injectable()
export class OrderdetailService {
    constructor(
        @InjectModel('orderDetail')
        private orderDetailModel = Model<OrderDetail>,
      ) {}

    async createOrderHistory(orderDetail: OrderDetailDto) {
        const neworderDetail = await this.orderDetailModel.create(orderDetail);
        if (!neworderDetail) throw new BadRequestException('Lỗi tạo mới đơn hàng')
        return neworderDetail;
      }
    
      async findOrderHistoryByUserId({ userId }) {
        return await this.orderDetailModel.find({ userId });
      }

      async findOrderDetailById({ orderId }) {
        return await this.orderDetailModel.find({_id: new Types.ObjectId(orderId)});
      }

      async findAllOrderHistory(){
        return await this.orderDetailModel.find();
      }


    async changeStatusOrderDetail({userId, orderDetailId, status}){
        const foundOrderDetail = await this.orderDetailModel.findOne({_id: orderDetailId, userId}).exec()
        if(!foundOrderDetail) throw new ForbiddenException('Lỗi không tìm thấy đơn hàng')
        
        const query = { _id: orderDetailId}, updateSet = { status },
        option = {upsert: true}

        // switch(status){
        //   case 5:
        //     await this.
        // }
        
        return await this.orderDetailModel.findOneAndUpdate(query, updateSet, option)
    }

    async isOrderDetailSuccess({userId, productId}){
      const foundOrderDetail = await this.orderDetailModel.find({userId})
      if(!foundOrderDetail) throw new Error("Không tìm thấy")

      
      const foundProduct = foundOrderDetail.filter(value => value.status === Status.COMPLETED).flatMap(val => val.products)
      .some(value => value.productId === productId)
            
      return foundProduct
    }


}
