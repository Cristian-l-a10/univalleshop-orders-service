import { Order } from "src/orders/domain/entities/order.entity";
import { OrderItem } from "src/orders/domain/entities/order-item.entity";
import { Money } from "src/orders/domain/value-objects/money.vo";
import { OrderStatus, OrderStatusVO } from "src/orders/domain/value-objects/order-status.vo";
import { OrderDocument } from "../persistence/order.schema";

//esta clase es responsable de mapear entre los documentos de MongoDB (OrderDocument) y las entidades de dominio (Order).
export class OrderMapper{
    //el método toDomain toma un documento de MongoDB y lo convierte a una entidad de dominio Order.
    static toDomain(document: OrderDocument): Order{
        const items = document.items.map(item => 
            new OrderItem(
                item.productId,
                item.productName,
                item.quantity,
                new Money({
                    amount:item.unitPrice,
                    currency:item.currency}
                ),
            ),
        );        
        return new Order(
            document.orderId,
            document.userId,
            items,
            new Money({
                amount:document.total,
                currency:document.currency}
            ),
            document.deliveryAddress,
            new OrderStatusVO(
                document.status as OrderStatus,
            ),
        );
    }

    //el método toPersistence toma una entidad de dominio Order y la convierte a un formato adecuado 
    // para ser almacenado en MongoDB como un documento.
    static toPersistence(order: Order): object{
        return{
            orderId: order.orderId,
            userId: order.userId,
            items: order.items.map(item => ({
                productId: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                unitPrice: item.unitPrice.amount,
                currency: item.unitPrice.currency,
                subtotal: item.subtotal.amount
            })),
            status: order.status.status,
            total: order.total.amount,
            currency: order.total.currency,
            deliveryAddress: order.deliveryAddress,
        };
    }
}