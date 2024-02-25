import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TokenKeysDocument = HydratedDocument<any>;

@Schema()
export class TokenKeys {
  @Prop({
    ref: 'user',
    required: true,
  })
  user: Types.ObjectId;

  @Prop({
    required: true,
  })
  privateKey: String;

  @Prop({
    required: true,
  })
  publicKey: String;

  @Prop({
    required: true,
  })
  refreshTokensUsed: string[];

  @Prop({
    required: true,
  })
  refreshToken: String;
}

export const TokenKeySchema = SchemaFactory.createForClass(TokenKeys);
