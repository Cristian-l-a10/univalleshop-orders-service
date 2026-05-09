import { Cart } from "src/orders/domain/entities/cart.entity";
import { OrderItem } from "src/orders/domain/entities/order-item.entity";
import { Money } from "src/orders/domain/value-objects/money.vo";
import { CartDocument } from "../persistence/order.schema";

//esta clase es responsable de mapear entre los documentos de MongoDB (CartDocument) y las entidades de dominio (Cart).
export class CartMapper{
    //el método toDomain toma un documento de MongoDB y lo convierte a una entidad de dominio Cart.
    static toDomain(document: CartDocument): Cart{
        const cart = new Cart(document.cartId, document.userId);

        for(const item of document.items){
            cart.addItem(new OrderItem(
                item.productId,
                item.productName,
                item.quantity,
                new Money({
                    amount:item.unitPrice,
                    currency:item.currency}
                ),
            ),);
        }
        return cart;
    }

    //el método toPersistence toma una entidad de dominio Cart y la convierte a un formato adecuado
    static toPersistence(cart: Cart): object{
        return{
            cartId: cart.cartId,
            userId: cart.userId,
            items: cart.items.map(item => ({
                producId: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                unitPrice: item.unitPrice.amount,
                currency: item.unitPrice.currency,
                subtotal: item.subtotal.amount
            })),
            total: cart.total.amount,
            currency: cart.total.currency,
        };
    }
}