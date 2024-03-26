import { ConflictException, Injectable } from '@nestjs/common';
import { CheckoutDto } from './dto/checkout.dto';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/product/product.service';
import { CartService } from 'src/cart/cart.service';
import { OrderHistoryService } from 'src/order-history/order-history.service';
import { OrderdetailService } from 'src/orderdetail/orderdetail.service';
import { EmailService } from 'src/email/email.service';
import { CheckoutProcessAbstract } from './checkout.template';
import { OrderHistoryDto } from 'src/order-history/dto/order-history.dto';

@Injectable()
export class CheckoutService extends CheckoutProcessAbstract {
  constructor(
    private userService: UserService,
    private productService: ProductService,
    private cartService: CartService,
    private orderDetailService: OrderdetailService,
    private emailService: EmailService,
  ) {
    super();
  }

  async validateUser(userId: string): Promise<void> {
    const getUser = await this.userService.findByUserId(userId);
    if (!getUser) throw new ConflictException('Không tìm thấy người dùng');
  }
  async validateCart(userId: string): Promise<any> {
    const findCart = await this.cartService.findCartByUserId(userId);
    if (!findCart) {
      throw new ConflictException('Giỏ hàng không tương đồng với người dùng');
    }
    return findCart;
  }
  async updateProducts(items: any[]): Promise<void> {
    for (let i = 0; i < items.length; i++) {
      const { idItemAttr, quantity, productId } = items.at(i);
      const product = await this.productService.getProductById({
        idProduct: productId,
      });
      if (!product)
        throw new ConflictException(`Không tìm thấy sản phẩm id: ${items[i]}`);

      await this.productService.updateQuantityProduct({
        productId,
        productAttrId: idItemAttr,
        quantityChange: -quantity,
      });
    }
  }

  async clearCart(userId: string, cartId: string): Promise<void> {
    await this.cartService.deleteAllItemCart({ userId, cartId });
  }

  async createOrderHistory(data): Promise<CheckoutDto> {
    const findCart = await this.cartService.findCartByUserId(data.userId);

    const orderHistory = await this.orderDetailService.createOrderHistory({
      ...data,
      products: findCart.items_cart,
    });

    return orderHistory;
  }

  // async reviewCheckout(infoCheckout: CheckoutDto) {

  //   // Send email after successful checkout
  //   // await this.emailService.sendOrderConfirmationEmail(infoCheckout);

  // }
}
