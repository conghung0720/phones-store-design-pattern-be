import { OrderHistoryDto } from "src/order-history/dto/order-history.dto";
import { CheckoutDto } from "./dto/checkout.dto";

export abstract class CheckoutProcessAbstract {
    abstract validateUser(userId): Promise<void>;
    abstract validateCart(userId): Promise<any[]>;
    abstract updateProducts(items: any[]): Promise<void>;
    abstract clearCart(userId, cartId): Promise<void>;
    abstract createOrderHistory(data: CheckoutDto): Promise<CheckoutDto>;
  
    public async execute(data: CheckoutDto) {
      const userId = data.userId;
      await this.validateUser(userId);
      const items = await this.validateCart(userId);
      await this.updateProducts(items);
      const orderHistory = await this.createOrderHistory(data);
      await this.clearCart(data.userId, data.cartId);
  
      return orderHistory;
    }
  }