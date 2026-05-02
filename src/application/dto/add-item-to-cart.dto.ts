// este DTO se utiliza para agregar un item al carrito de compras de un usuario, donde se necesita el ID del usuario, 
// el ID del producto y la cantidad que se desea agregar al carrito.
export interface AddItemToCartDto{
    userId: string;
    productId: string;
    quantity: number;    
}