import { OrderItem } from './order-item.entity';
import { OrderStatusVO } from '../value-objects/order-status.vo';
import { OrderStatus } from '../value-objects/order-status.vo';
import { Money } from '../value-objects/money.vo';
import { Cart } from './cart.entity';
import { InvalidOrderStateException } from './invalid-order-state.exception';

// 
type DeliveryAddress = {
  street: string;
  city: string;
  department: string;
  postalCode: string;
};

export class Order {
  public readonly orderId: string;
  public readonly userId: string;
  public readonly items: OrderItem[];
  public status: OrderStatusVO;
  public readonly total: Money;
  public readonly deliveryAddress: DeliveryAddress;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(
    orderId: string,
    userId: string,
    items: OrderItem[],
    total: Money,
    deliveryAddress: DeliveryAddress,
    status: OrderStatusVO
  ) {
    this.orderId = orderId;
    this.userId = userId;
    this.items = items;
    this.total = total;
    this.deliveryAddress = deliveryAddress;
    this.status = status;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  
  static createFromCart(
    cart: Cart,
    deliveryAddress: DeliveryAddress,
    userId: string
  ): Order {
    if (cart.isEmpty()) {
      throw new InvalidOrderStateException('EMPTY', 'create order', '');
    }

    // copiar items (no referencia)
    const itemsCopy = cart.items.map(
      item =>
        new OrderItem(
          item.productId,
          item.productName,
          item.quantity,
          item.unitPrice
        )
    );

    return new Order(
      crypto.randomUUID(),
      userId,
      itemsCopy,
      cart.total,
      deliveryAddress,
      new OrderStatusVO(OrderStatus.PENDING)
    );
  }

  cancel(): void {
    if (!this.status.canTransitionTo(OrderStatus.CANCELLED)) {
      throw new InvalidOrderStateException('', '', '');
    }

    this.status = new OrderStatusVO(OrderStatus.CANCELLED);
    this.updatedAt = new Date();
  }

  updateStatus(newStatus: OrderStatus): void {
    if (!this.status.canTransitionTo(newStatus)) {
      throw new InvalidOrderStateException('', '', '');
    }

    this.status = new OrderStatusVO(newStatus);
    this.updatedAt = new Date();
  }
}