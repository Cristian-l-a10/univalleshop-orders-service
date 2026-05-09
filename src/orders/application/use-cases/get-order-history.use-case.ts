import { Inject, Injectable } from "@nestjs/common";
import { ORDER_RESPOSITORY } from "src/orders/domain/repositories/order-repository.interface";
import type { IOrderRepository } from "src/orders/domain/repositories/order-repository.interface";
import { Order } from "src/orders/domain/entities/order.entity";
import { GetOrderDetailDto } from "../dto/get-order-detail.dto";
import { InvalidOrderStateException } from "src/orders/domain/entities/invalid-order-state.exception";

//esta clase es un caso de uso que se encarga de obtener el historial de órdenes de un usuario, así como los detalles de una orden específica.
@Injectable()

export class GetOrderHistoryUseCase{
    constructor(
        @Inject(ORDER_RESPOSITORY)
        private readonly orderRepository: IOrderRepository
    ){}

    //el método execute es el método principal del caso de uso, que recibe el ID del usuario y devuelve una lista de órdenes ordenadas 
    // por fecha de creación (de más reciente a más antigua).
    async execute(userId: string): Promise<Order[]>{
        const orders = await this.orderRepository.findOrdersUserById(userId);

        return orders.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        );
    }

    // el método getDetail es un método adicional que permite obtener los detalles de una orden específica, verificando que la orden
    async getDetail(dto: GetOrderDetailDto): Promise<Order>{
        const order = await this.orderRepository.findOrderById(dto.orderId);

        if(!order){
            throw new InvalidOrderStateException('', '', '');
        }

        if(order.userId !== dto.userId){
            throw new InvalidOrderStateException('', '', '');
        }

        return order;
    }
}