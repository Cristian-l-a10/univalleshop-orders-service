import { Inject, Injectable } from "@nestjs/common";
import { ORDER_RESPOSITORY } from "src/orders/domain/repositories/order-repository.interface";
import type { IOrderRepository } from "src/orders/domain/repositories/order-repository.interface";
import { CATALOG_CLIENT } from "src/orders/domain/repositories/catalog-client.interface";
import type { ICatalogClient } from "src/orders/domain/repositories/catalog-client.interface";
import { USER_CLIENT } from "src/orders/domain/repositories/user-client.interface";
import type { IUserClient } from "src/orders/domain/repositories/user-client.interface";
import { CheckoutOrderDto } from "../dto/checkout-order.dto";
import { Order } from "src/orders/domain/entities/order.entity";
import { InvalidOrderStateException } from "src/orders/domain/entities/invalid-order-state.exception";

//esta clase es un caso de uso que se encarga de procesar el checkout de una orden, es decir, convertir el carrito de compras de un usuario en una orden finalizada.
@Injectable()
export class CheckOutOrderUseCase{
    constructor(
        @Inject(ORDER_RESPOSITORY)
        private readonly orderRepository: IOrderRepository,

        @Inject(CATALOG_CLIENT)
        private readonly catalogClient: ICatalogClient,

        @Inject(USER_CLIENT)
        private readonly userClient: IUserClient
    ){}

    //el método execute es el método principal del caso de uso, que recibe un DTO con la información necesaria para realizar el checkout de una orden. 
    async execute(dto: CheckoutOrderDto, token?: string): Promise<Order>{
        const cart = await this.orderRepository.findCartByUserId(dto.userId);

        if(!cart || cart.isEmpty()){
            throw new InvalidOrderStateException('', '', '');
        }

        await this.userClient.getByUserId(dto.userId);

        const address = await this.userClient.getAddressById(dto.userId, dto.addressId);

        for(const item of cart.items){
            const hasStock = await this.catalogClient.validateStock(item.productId, item.quantity);            

            if(!hasStock){
                throw new InvalidOrderStateException('', '', '')
            }
        }

        // crear orden a partir del carrito
        const order = Order.createFromCart(
            cart,
            address,
            dto.userId
        )

        // guardar orden
        await this.orderRepository.saveOrder(order);

        // descontar stock de los productos comprados. Si ocurre un error al descontar el stock, se restaurará 
        // el stock de los productos que ya se habían descontado.
        const discounted:{
            productId: string,
            quantity: number            
        }[] = [];

        try{            
            // descontar stock de los productos comprados. Si ocurre un error al descontar el stock, se restaurará
            for(const item of cart.items){
                await this.catalogClient.decrementStock(item.productId, item.quantity);

                discounted.push({productId: item.productId, quantity: item.quantity});
            }
        }catch(error){
            // restaurar stock de los productos que ya se habían descontado
            for(const item of discounted){
                await this.catalogClient.restoreStock(item.productId, item.quantity);
            }
            throw error;
        }

        // limpiar carrito
        cart.clear();

        // guardar carrito limpio
        await this.orderRepository.saveCart(cart);

        return order;
    }
}