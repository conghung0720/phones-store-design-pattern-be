import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Error, Model, Types } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async findByUsername(
    userName,
    select = {
      userName: 1,
      password: 1,
      roles: 1,
    },
  ) {
    return await this.userModel.findOne({ userName }).select(select);
  }

  async getById(userId) {
    return await this.userModel.findById(userId);
  }

  async changeProfileUser({ user }) {
    const foundUser = await this.userModel.findById(user._id);
    if (!foundUser) throw new ForbiddenException('Không tìm thấy user')
    const filter = { _id: new Types.ObjectId(user._id) }, newUpdate = { ...user, _id: new Types.ObjectId(user._id) },
      option = { upsert: true, new: true }

    return await this.userModel.findByIdAndUpdate(filter, newUpdate, option)
  }

  async getAll() {
    return await this.userModel.find().exec()
  }
}
