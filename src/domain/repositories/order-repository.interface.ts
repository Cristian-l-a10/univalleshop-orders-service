import { Cart } from "../entities/cart.entity";
import { Order } from "../entities/order.entity";

//este archivo define la interfaz IOrderRepository, que es un contrato para un repositorio que maneja operaciones relacionadas con carritos y órdenes.
export const ORDER_RESPOSITORY = 'ORDER_RESPOSITORY';

//la interfaz IOrderRepository define los métodos que el repositorio de órdenes debe implementar para guardar y recuperar carritos y órdenes.
export interface IOrderRepository{

    saveCart(cart: Cart): Promise <void>;

    findCartByUserId(userId: string): Promise <Cart | null>;

    saveOrder(order: Order): Promise <void>;

    findOrderById(orderId: string): Promise <Order | null>

    findOrdersUserById(userId: string): Promise <Order[]>;

}