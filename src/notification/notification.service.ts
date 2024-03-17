import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('notification')
    private notificationModel = Model<Notification>,
  ) {}
  async create(notification: Notification): Promise<Notification> {
    const createdNotification = new this.notificationModel(notification);
    return createdNotification.save();
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationModel.find().exec();
  }

  async findOne(id: string): Promise<Notification> {
    return this.notificationModel.findById(id).exec();
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
