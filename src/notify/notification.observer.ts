import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FavoriteProduct } from 'src/product/schemas/favorite.schema';
import { Product } from 'src/product/schemas/product.schema';
import { notificationDecreasePrice } from './templates/notification.template';

interface Observer {
  subscribe(userId: string, productId: string): void;
  unSubscribe(userId: string, productId: string): void;
  notify(productId: string): void;
}

@Injectable()
export class NotificationObserver implements Observer {
  constructor(
    @InjectModel('notification')
    private notificationModel = Model<Notification>,
    @InjectModel(FavoriteProduct.name)
    private favoriteModel: Model<FavoriteProduct>,
    @InjectModel(Product.name) private productModel: Model<Product>
  ) {}

  public async subscribe(userId: string, productId: string) {
    const users = this.favoriteModel
      .findOne({ product: new Types.ObjectId(productId) })
      .exec();
    const notify = await this.notificationModel
      .findOne({
        product: new Types.ObjectId(productId),
      })
      .exec();
    if (!notify) {
      await this.notificationModel.create({
        product_id: new Types.ObjectId(productId),
        user_id: new Types.ObjectId(userId),
      });
    }

    if (!users) {
      throw new BadRequestException('Not found users');
    }
  }
  public async unSubscribe(userId: string, productId: string) {
    const notifications = await this.notificationModel
      .find({
        product_id: new Types.ObjectId(productId),
        user_id: new Types.ObjectId(userId),
      })
      .exec();

    if (!notifications.length) {
      throw new BadRequestException('Notification not found');
    }

    for (let notify of notifications) {
      if (!notify.is_send) {
        await this.notificationModel.deleteOne({ _id: notify._id });
      }
    }

    return notifications;
  }

  public async notify(productId: string) {
    const notifyProducts = await this.notificationModel
      .find({ product_id: new Types.ObjectId(productId) })
      .exec();
    const product = await this.productModel.findOne({ _id: new Types.ObjectId(productId) }).exec();
    const { title, description } = notificationDecreasePrice(product.name, product.attributes[0].price);
    for (let notify of notifyProducts) {
      if (!notify.is_send) {
        const query = { _id: new Types.ObjectId(notify._id) },
          update = {
            is_send: true,
            title,
            content: description,
            image: product.attributes[0].image,
          },
          options = { upsert: true };

        await this.notificationModel.findOneAndUpdate(query, update, options).exec();

        const existingNotification = await this.notificationModel.findOne({
          user_id: notify.user_id,
          product_id: new Types.ObjectId(productId),
          is_send: false,
        }).exec();
        if (!existingNotification) {
          const newNotification = await this.notificationModel.create({
            user_id: notify.user_id,
            product_id: new Types.ObjectId(productId),
            is_send: false,
          });
          await newNotification.save();
        }
      }
    }
  }
}
