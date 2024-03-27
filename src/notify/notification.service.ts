import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProductService } from 'src/product/product.service';
import { Product, ProductSchema } from 'src/product/schemas/product.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('notification')
    private notificationModel = Model<Notification>,
    @InjectModel(Product.name)
    private productModel = Model<Product>,
  ) {}
  async create(notification: Notification): Promise<Notification> {
    const createdNotification = new this.notificationModel(notification);
    return createdNotification.save();
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationModel.find().exec();
  }

  async findOne(userId: string): Promise<any> {
    const notifications = await this.notificationModel
      .find({ user_id: new Types.ObjectId(userId), is_send: true })
      .exec();
  
    const productData = await Promise.all(
      notifications.map(async (notification) => {
        const data = await this.productModel.findOne({ _id: notification.product_id }).exec();
        return {
          ...notification._doc,
        };
      })
    );
  
    return productData?.reverse();
  }

  async markAllAsRead(userId: string): Promise<any> {
    const notifications = await this.notificationModel
      .find({ user_id: new Types.ObjectId(userId) })
      .exec();
  
    if (notifications.length === 1) {
      return this.notificationModel
        .updateOne(
          { _id: notifications[0]._id },
          { is_read_all: true }
        )
        .exec();
    }
  
    const recentNotification = notifications.reduce((latest, notification) => {
      return (!latest || notification.createdAt > latest.createdAt) ? notification : latest;
    }, null);
  
    if (recentNotification) {
      return this.notificationModel.updateMany(
        { 
          user_id: new Types.ObjectId(userId),
          _id: { $ne: recentNotification._id }
        },
        { is_read_all: true }
      ).exec();
    }
  
    return [];
  }

  async countSentNotifications(userId: string): Promise<number> {
    const count = await this.notificationModel.countDocuments({ user_id: new Types.ObjectId(userId), is_read_all: false, is_send: true }).exec();
    console.log("🚀 ~ NotificationService ~ countSentNotifications ~ count:", count)
    return count;
  }

  async update(id: string, notification: Notification): Promise<Notification> {
    return this.notificationModel.findByIdAndUpdate(id, notification, {
      new: true,
    });
  }

  async remove(id: string): Promise<Notification> {
    return this.notificationModel.findByIdAndRemove(id);
  }
}
