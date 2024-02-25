import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class User {
  @Prop({
    unique: true,
    required: true,
    length: 30,
  })
  userName: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    unique: true,
    required: true,
  })
  email: string;

  @Prop({
    default: "Chưa đặt tên"
  })
  fullName: string

  @Prop({
    data: Buffer,
    contentType: String,
    default: 'https://simpleicon.com/wp-content/uploads/user1.png',
  })
  avatar: string;

  @Prop()
  address: string | undefined;

  // @Prop()
  // role: string
}

export const UserSchema = SchemaFactory.createForClass(User);
