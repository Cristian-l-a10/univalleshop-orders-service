import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import type { IOrderRepository } from "src/domain/repositories/order-repository.interface";
import { CartDocument, OrderDocument } from "./order.schema";
import { Cart } from "src/domain/entities/cart.entity";
import { Order } from "src/domain/entities/order.entity";
import { OrderItem } from "src/domain/entities/order-item.entity";
import { Money } from "src/domain/value-objects/money.vo";
import { OrderStatus, OrderStatusVO} from "src/domain/value-objects/order-status.vo";
import { CartMapper } from "../mappers/cart.mapper";
import { OrderMapper } from "../mappers/order.mapper";

//esta clase implementa la interfaz IOrderRepository y utiliza Mongoose para interactuar con MongoDB.
@Injectable()
export class MongoOrderRepository implements IOrderRepository{
    //el decorador @InjectModel se utiliza para inyectar los modelos de Mongoose correspondientes a los documentos de carrito y orden.
    constructor(
        @InjectModel(CartDocument.name)
        private readonly cartModel: Model<CartDocument>,

        @InjectModel(OrderDocument.name)
        private readonly orderModel: Model<OrderDocument>
    ){}

    //este método guarda un carrito en la base de datos utilizando el modelo de Mongoose correspondiente. 
    // Si el carrito ya existe, se actualiza; de lo contrario, se crea uno nuevo.
    async saveCart(cart: Cart): Promise<void>{
        await this.cartModel.findOneAndUpdate({cartId: cart.cartId},
            CartMapper.toPersistence(cart),
            {
                upsert: true,
                new : true
            },
        );
    }

    //este método busca un carrito en la base de datos por el ID del usuario. Si se encuentra un documento, 
    // se convierte a la entidad de dominio Cart utilizando el CartMapper; de lo contrario, se devuelve null.
    async findCartByUserId(userId: string): Promise<Cart | null>{
        const doc = await this.cartModel.findOne({userId});
        if(!doc){
            return null;
        }
        return CartMapper.toDomain(doc);
    }

    //este método guarda una orden en la base de datos utilizando el modelo de Mongoose correspondiente.
    async saveOrder(order: Order): Promise<void>{
        await this.orderModel.findOneAndUpdate({orderId: order.orderId},
            OrderMapper.toPersistence(order),
            {
                upsert: true,
                new: true
            },
        );
    }

    //este método busca una orden en la base de datos por el ID de la orden. Si se encuentra un documento,
    // se convierte a la entidad de dominio Order utilizando el OrderMapper; de lo contrario, se devuelve null.
    async findOrderById(orderId: string): Promise<Order | null>{
        const doc = await this.orderModel.findOne({orderId});
        if(!doc){
            return null;
        }
        return OrderMapper.toDomain(doc);
    }

    //este método busca todas las órdenes de un usuario en la base de datos por el ID del usuario. Si se encuentran documentos,
    // se convierten a la entidad de dominio Order utilizando el OrderMapper y se devuelven como un array; de lo contrario, se devuelve un array vacío.
    async findOrdersUserById(userId: string): Promise<Order[]>{
        const docs = await this.orderModel.find({userId}).sort({createdAt: -1});
        return docs.map(doc => OrderMapper.toDomain(doc));
    }    
}