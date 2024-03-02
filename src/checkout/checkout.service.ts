import { ConflictException, Injectable } from '@nestjs/common';
import { CheckoutDto } from './dto/checkout.dto';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/product/product.service';
import { CartService } from 'src/cart/cart.service';
import { OrderHistoryService } from 'src/order-history/order-history.service';
import { OrderdetailService } from 'src/orderdetail/orderdetail.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class CheckoutService {
  constructor(
    private userService: UserService,
    private productService: ProductService,
    private cartService: CartService,
    private orderDetailService: OrderdetailService,
    private emailService: EmailService,
  ) {}

  async reviewCheckout(infoCheckout: CheckoutDto) {
    const { userId, cartId, price_sale, percent_sale, ...historyOrder } =
      infoCheckout;
    const getUser = await this.userService.findByUserId(userId);
    if (!getUser) throw new ConflictException('Không tìm thấy người dùng');

    const findCart = await this.cartService.findCartByUserId(userId);
    if (!findCart) {
      throw new ConflictException('Giỏ hàng không tương đồng với người dùng');
    }

    for (let i = 0; i < findCart.items_cart.length; i++) {
      const { idItemAttr, quantity, productId } = findCart.items_cart.at(i);
      const product = await this.productService.getProductById({
        idProduct: productId,
      });
      if (!product)
        throw new ConflictException(
          `Không tìm thấy sản phẩm id: ${findCart.items_cart[i]}`,
        );

      await this.productService.updateQuantityProduct({
        productId,
        productAttrId: idItemAttr,
        quantityChange: -quantity,
      });
    }

    await this.cartService.deleteAllItemCart({ userId, cartId });

    const orderHistory = await this.orderDetailService.createOrderHistory({
      ...infoCheckout,
      products: findCart.items_cart,
      price_sale,
      percent_sale,
    });

    // Send email after successful checkout
    await this.emailService.sendOrderConfirmationEmail(infoCheckout);

    return orderHistory;
  }
}
