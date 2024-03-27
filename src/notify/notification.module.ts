import { Global, Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './schemas/notification.schema';
import { NotificationObserver } from './notification.observer';
import { FavoriteProduct, FavoriteProductSchema } from 'src/product/schemas/favorite.schema';
import { ProductService } from 'src/product/product.service';
import { ProductModule } from 'src/product/product.module';
import { Product, ProductSchema } from 'src/product/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'notification', schema: NotificationSchema }]),
    MongooseModule.forFeature([{ name: FavoriteProduct.name, schema: FavoriteProductSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),

  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationObserver],
  exports: [NotificationObserver]
})
export class NotificationModule {}
