import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { OrderdetailModule } from 'src/orderdetail/orderdetail.module';
import { UserModule } from 'src/user/user.module';
import { UserSchema } from 'src/user/schemas/user.schema';
import { FavoriteProduct, FavoriteProductSchema } from './schemas/favorite.schema';
import { NotificationModule } from 'src/notify/notification.module';
import { NotificationObserver } from 'src/notify/notification.observer';
import { NotificationSchema } from 'src/notify/schemas/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'notification', schema: NotificationSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: FavoriteProduct.name, schema: FavoriteProductSchema }]),
    OrderdetailModule, UserModule, NotificationModule
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
