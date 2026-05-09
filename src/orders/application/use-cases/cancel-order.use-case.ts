import { Inject, Injectable } from "@nestjs/common";
import { ORDER_RESPOSITORY } from "src/orders/domain/repositories/order-repository.interface";
import type { IOrderRepository } from "src/orders/domain/repositories/order-repository.interface";
import { CATALOG_CLIENT } from "src/orders/domain/repositories/catalog-client.interface";
import type { ICatalogClient } from "src/orders/domain/repositories/catalog-client.interface";
import { CancelOrderDto } from "../dto/cancel-order.dto";
import { Order } from "src/orders/domain/entities/order.entity";
import { InvalidOrderStateException } from "src/orders/domain/entities/invalid-order-state.exception";

//esta clase es un caso de uso que se encarga de cancelar una orden, verificando que la orden exista, que pertenezca 
// al usuario que realiza la solicitud y que se encuentre en un estado válido para ser cancelada.
@Injectable()
export class CancelOrderUseCase{
    constructor(
        @Inject(ORDER_RESPOSITORY)
        private readonly orderRepository: IOrderRepository,

        @Inject(CATALOG_CLIENT)
        private readonly catalogClient: ICatalogClient
    ){}

    //el método execute es el método principal del caso de uso, que recibe un DTO con la información necesaria para cancelar una orden y devuelve la orden cancelada.
    async execute(dto: CancelOrderDto): Promise<Order>{
        const order = await this.orderRepository.findOrderById(dto.orderId);

        if(!order){
            throw new InvalidOrderStateException('', '', '')
        }

        if(order.userId !== dto.userId){
            throw new InvalidOrderStateException('', '', '');
        }

        // verificar que la orden se encuentre en un estado válido para ser cancelada (por ejemplo, no se puede cancelar una orden que ya ha sido entregada).
        order.cancel();

        // restaurar stock de los productos de la orden cancelada
        for(const item of order.items){
            await this.catalogClient.restoreStock(item.productId, item.quantity);
        }

        // guardar orden cancelada
        await this.orderRepository.saveOrder(order);

        return order;
    }
}