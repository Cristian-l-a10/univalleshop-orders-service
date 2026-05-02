// este DTO se utiliza para actualizar la cantidad de un item en el carrito de compras de un usuario.
export interface UpdateCartItemDto{
    userId: string;
    productId: string;
    quantity: number;
}