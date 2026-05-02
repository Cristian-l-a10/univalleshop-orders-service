import { Inject, Injectable } from "@nestjs/common";
import { ORDER_RESPOSITORY } from "src/domain/repositories/order-repository.interface";
import type { IOrderRepository } from "src/domain/repositories/order-repository.interface";
import { CATALOG_CLIENT } from "src/domain/repositories/catalog-client.interface";
import type { ICatalogClient } from "src/domain/repositories/catalog-client.interface";
import { UpdateCartItemDto } from "../dto/update-cart-item.dto";
import { Cart } from "src/domain/entities/cart.entity";
import { InvalidOrderStateException } from "src/domain/entities/invalid-order-state.exception";

//esta clase es un caso de uso que se encarga de actualizar los items en el carrito de compras de un usuario.
@Injectable()
export class UpdateCartUseCase{
    //el constructor de la clase utiliza la inyección de dependencias para obtener una instancia del repositorio de órdenes y del cliente de catálogo.
    constructor(
        //el decorador @Inject se utiliza para inyectar la implementación concreta del repositorio de órdenes y del cliente de catálogo, 
        // utilizando los tokens definidos en las interfaces.
        @Inject(ORDER_RESPOSITORY)
        private readonly orderRepository: IOrderRepository,
        
        @Inject(CATALOG_CLIENT)
        private readonly catalogClient: ICatalogClient,
    ){}

    //el método execute es el método principal del caso de uso, que recibe un DTO con la información necesaria para actualizar un item en el carrito.
    async execute(dto: UpdateCartItemDto): Promise<Cart>{
        const cart = await this.orderRepository.findCartByUserId(dto.userId);

        if(!cart){
            throw new InvalidOrderStateException('', '', '');
        }

        if(dto.quantity > 0){
            const hasStock = await this.catalogClient.validateStock(dto.productId, dto.quantity);

            if(!hasStock){
                throw new InvalidOrderStateException('', '', '');
            }
        }

        cart.updateItem(
            dto.productId,
            dto.quantity
        );

        await this.orderRepository.saveCart(cart)
        return cart;
    }

    // el método clear es un método adicional que permite limpiar el carrito de compras de un usuario, eliminando todos los items del carrito.
    async clear(userId: string): Promise<void>{
        const cart = await this.orderRepository.findCartByUserId(userId);

        if(!cart){
            throw new InvalidOrderStateException('', '', '');
        }

        cart.clear();

        await this.orderRepository.saveCart(cart);
    }
}
