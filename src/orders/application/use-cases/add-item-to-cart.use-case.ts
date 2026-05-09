import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { ORDER_RESPOSITORY } from "../../domain/repositories/order-repository.interface";
import type { IOrderRepository } from "../../domain/repositories/order-repository.interface";
import { CATALOG_CLIENT } from "src/orders/domain/repositories/catalog-client.interface";
import type { ICatalogClient} from "src/orders/domain/repositories/catalog-client.interface";
import { AddItemToCartDto } from "../dto/add-item-to-cart.dto";
import { Cart } from "src/orders/domain/entities/cart.entity";
import { OrderItem } from "src/orders/domain/entities/order-item.entity";
import { Money } from "src/orders/domain/value-objects/money.vo";
import { InvalidOrderStateException } from "src/orders/domain/entities/invalid-order-state.exception";

//esta clase es un caso de uso que se encarga de agregar un item al carrito de compras de un usuario, 
// verificando que el producto exista y que haya stock disponible.
@Injectable()
export class AddItemToCartUseCase{
    constructor(
        @Inject(ORDER_RESPOSITORY) 
        private readonly orderRepository: IOrderRepository,
        @Inject(CATALOG_CLIENT)
        private readonly catalogClient: ICatalogClient,
    ){}

    //el método execute es el método principal del caso de uso, que recibe un DTO con la información necesaria 
    // para agregar un item al carrito y devuelve el carrito actualizado.
    async execute(dto: AddItemToCartDto): Promise<Cart>{
        const product = await this.catalogClient.getProductId(dto.productId);

        const hasStock = await this.catalogClient.validateStock(dto.productId, dto.quantity);

        if(!hasStock){
            throw new InvalidOrderStateException('', '', '');
        }

        // buscar carrito del usuario
        let cart = await this.orderRepository.findCartByUserId(dto.userId);

        // si el carrito no existe, crear uno nuevo
        if(!cart){
            cart = new Cart(randomUUID(), dto.userId);
        }

        // crear item de orden a partir del producto y la cantidad solicitada
        const orderItem = new OrderItem(product.productId, product.name, dto.quantity, new Money({ amount: product.price }))

        // agregar item al carrito
        cart.addItem(orderItem);
        await this.orderRepository.saveCart(cart);
        return cart;
    }
}