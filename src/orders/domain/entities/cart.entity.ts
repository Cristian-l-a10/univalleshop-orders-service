import { Money } from "../value-objects/money.vo";
import { InvalidOrderStateException } from "./invalid-order-state.exception";
import { OrderItem } from "./order-item.entity";

// la clase Cart representa el carrito de compras de un usuario, que contiene una lista de artículos (OrderItem) 
// y el total de la compra. Esta clase es esencial para gestionar las operaciones relacionadas con el carrito, 
// como agregar, actualizar o eliminar artículos, así como para calcular el total de la compra. Además, incluye
//  validaciones para asegurar que las operaciones realizadas en el carrito sean válidas, como no permitir 
// cantidades negativas o eliminar artículos que no existen en el carrito.
export class Cart{
    public readonly cartId: string;    
    public readonly userId: string;
    public items: OrderItem[];
    public total: Money;
    public readonly createdAt: Date;    
    public updateAt: Date;

    // el constructor de la clase Cart recibe el ID del carrito y el ID del usuario, e inicializa la lista de artículos 
    // como un array vacío, el total como un objeto Money con un monto de 0, y las fechas de creación y actualización con 
    // la fecha actual. Esto establece el estado inicial del carrito cuando se crea por primera vez.
    constructor(cartId: string, userId: string){
        this.cartId = cartId;
        this.userId = userId;
        this.items = [];
        this.total = new Money({amount:0});
        this.createdAt = new Date();
        this.updateAt = new Date();
    }

    // el método addItem recibe un objeto OrderItem y lo agrega a la lista de artículos del carrito.
    addItem(item: OrderItem): void{
        const existinItem = this.items.find(i => i.productId === item.productId);

        if(existinItem){
            const updateItem = existinItem.updateQuantity(existinItem.quantity + item.quantity);
            this.items = this.items.map(i => i.productId === item.productId ? updateItem : i);
        }else{
            this.items.push(item);
        }

        this.recalculateTotal();
        this.updateAt = new Date();        
    }

    // el método updateItem recibe el ID de un producto y una nueva cantidad, y actualiza la cantidad del artículo correspondiente en el carrito.
    updateItem(productId: string, quantity: number){
        const index = this.items.findIndex(i => i.productId === productId)

        if(index === -1){
            throw new InvalidOrderStateException(
                'INVALID_UPDATE', // estado
                'Actualizar carrito',    // acción
                'El monto no puede ser negativo')
        }

        if (quantity === 0) {
            this.removeItem(productId);
            return;
        }

        const item = this.items[index];
        const updatedItem = item.updateQuantity(quantity);
        this.items[index] = updatedItem;
        this.recalculateTotal();
        this.updateAt = new Date();
    }

    // el método removeItem recibe el ID de un producto y elimina el artículo correspondiente de la lista de artículos del carrito.
    removeItem(productId: string): void {
    this.items = this.items.filter(i => i.productId !== productId);

    this.recalculateTotal();
    this.updateAt = new Date();
    }

    // el método clear vacía la lista de artículos del carrito.
    clear(): void {
        this.items = [];
        this.total = new Money({amount:0});
        this.updateAt = new Date();
    }

    // el método isEmpty verifica si la lista de artículos del carrito está vacía.
    isEmpty(): boolean {
        return this.items.length === 0;
    }

    // el método recalculateTotal calcula el total de la compra sumando los subtotales 
    // de todos los artículos en la lista de artículos del carrito. 
    private recalculateTotal(): void {
        let total = new Money({amount:0});

        for (const item of this.items) {
        total = total.add(item.subtotal);
        }

        this.total = total;
    }
}