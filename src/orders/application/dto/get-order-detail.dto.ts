// este DTO se utiliza para obtener los detalles de una orden específica de un usuario, incluyendo el ID del usuario y el ID de la orden.
export interface GetOrderDetailDto{
    userId: String;
    orderId: string;
}