import { OrderItem } from './order-item.entity';
import { OrderStatusVO } from '../value-objects/order-status.vo';
import { OrderStatus } from '../value-objects/order-status.vo';
import { Money } from '../value-objects/money.vo';
import { Cart } from './cart.entity';
import { InvalidOrderStateException } from './invalid-order-state.exception';

// Para simplificar, el delivery address es un objeto plano. En una aplicación real, 
type DeliveryAddress = {
  street: string;
  city: string;
  department: string;
  postalCode: string;
};

// La entidad Order representa una orden de compra realizada por un usuario. Contiene información sobre 
// los items comprados, el estado de la orden, el total a pagar y la dirección de entrega.
export class Order {
  public readonly orderId: string;
  public readonly userId: string;
  public readonly items: OrderItem[];
  public status: OrderStatusVO;
  public readonly total: Money;
  public readonly deliveryAddress: DeliveryAddress;
  public readonly createdAt: Date;
  public updatedAt: Date;

  // El constructor de la clase Order inicializa las propiedades de la orden, incluyendo el ID de la orden, el ID del usuario,
  //  los items, el total, la dirección de entrega y el estado inicial de la orden (PENDING).
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

  // El método createFromCart es un método estático que permite crear una nueva orden a partir de un carrito de compras.
  static createFromCart(cart: Cart, deliveryAddress: DeliveryAddress, userId: string): Order {
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

  // El método cancel permite cancelar la orden, pero solo si el estado actual de la orden permite la transición a CANCELLED.
  cancel(): void {
    if (!this.status.canTransitionTo(OrderStatus.CANCELLED)) {
      throw new InvalidOrderStateException('', '', '');
    }

    this.status = new OrderStatusVO(OrderStatus.CANCELLED);
    this.updatedAt = new Date();
  }

  // El método updateStatus permite actualizar el estado de la orden, pero solo si la transición al nuevo estado es 
  // válida según las reglas definidas en OrderStatusVO.
  updateStatus(newStatus: OrderStatus): void {
    if (!this.status.canTransitionTo(newStatus)) {
      throw new InvalidOrderStateException('', '', '');
    }

    this.status = new OrderStatusVO(newStatus);
    this.updatedAt = new Date();
  }
}