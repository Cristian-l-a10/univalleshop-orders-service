// este DTO se utiliza para realizar el proceso de checkout de una orden, donde se necesita el ID del 
// usuario y el ID de la dirección de envío para completar la compra.
export interface CheckoutOrderDto{
    userId: string;
    addressId: string;
}