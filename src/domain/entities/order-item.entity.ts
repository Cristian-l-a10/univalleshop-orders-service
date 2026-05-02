import { Money } from "../value-objects/money.vo";
import { InvalidOrderStateException } from "./invalid-order-state.exception";

// la clase OrderItem representa un artículo específico en una orden, con detalles como el 
// ID del producto, el nombre del producto, la cantidad, el precio unitario y el subtotal. 
// Esta clase es fundamental para calcular el total de la orden y para gestionar las actualizaciones 
// de cantidad de los artículos en el carrito de compras. Además, incluye validaciones para asegurar que 
// la cantidad sea mayor a cero, lo que ayuda a mantener la integridad de los datos en el sistema de pedidos.
export class OrderItem{
    public readonly productId: string;
    public readonly productName: string;
    public readonly quantity: number;
    public readonly unitPrice: Money;
    public readonly subtotal: Money;

    // el constructor de la clase OrderItem recibe los detalles del artículo, incluyendo el ID del producto, el nombre del producto, la cantidad y el precio unitario. Además, calcula el subtotal multiplicando el precio unitario por la cantidad. Si la cantidad es menor o igual a cero, se lanza una excepción InvalidOrderStateException para garantizar que no se puedan crear artículos con cantidades inválidas.
    constructor(productId: string, productName: string, quantity: number, unitPrice: Money){
        if(quantity<=0){
            throw new InvalidOrderStateException(
                'INVALID_QUANTITY', // estado
                'Agregar Cantidad',    // acción
                'La cantidad debe ser mayor a cero');
        }
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.unitPrice = unitPrice;

        this.subtotal = unitPrice.multiply(quantity);
    }

    // el método updateQuantity recibe una nueva cantidad y devuelve un nuevo objeto OrderItem con la cantidad actualizada. 
    // Si la nueva cantidad es menor o igual a cero, se lanza una excepción InvalidOrderStateException para garantizar que 
    // no se puedan actualizar artículos con cantidades inválidas.
    updateQuantity(newQuantity: number): OrderItem{
        if(newQuantity <=0){
            throw new InvalidOrderStateException(
                'INVALID_QUANTITY', // estado
                'Agregar Cantidad',    // acción
                'La cantidad debe ser mayor a cero');
        }

        // al actualizar la cantidad, también se recalcula el 
        // subtotal multiplicando el precio unitario por la nueva cantidad. no se rorna el subtotal porque es un 
        // valor calculado a partir de la cantidad y el precio unitario, y no se almacena como una propiedad mutable 
        // en el objeto OrderItem. En su lugar, se devuelve un nuevo objeto OrderItem con la cantidad actualizada, y 
        // el subtotal se recalcula automáticamente en el constructor de la clase OrderItem.
        return new OrderItem(
            this.productId,
            this.productName,
            newQuantity,
            this.unitPrice
        );
    }
}