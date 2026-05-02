// este DTO se utiliza para cancelar una orden específica de un usuario, donde se necesita el ID del 
// usuario y el ID de la orden que se desea cancelar.
export interface CancelOrderDto{
    userId: string;
    orderId: string;
}