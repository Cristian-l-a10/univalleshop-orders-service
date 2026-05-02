import { Prop,Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

//aqui se definen los schemas de las colecciones de MongoDB para los documentos de carrito y orden
class ItemSchema{
    @Prop({required: true})
    productId!: string;
    
    @Prop({required: true})
    productName!: string;

    @Prop({required: true})
    quantity!: number;

    @Prop({required: true})
    unitPrice!: number;

    @Prop({required: true, default: 'COP'})
    currency!: string;

    @Prop({required: true})
    subtotal!: number
}

//el decorador @Schema se utiliza para definir un esquema de Mongoose 
// para la colección de MongoDB correspondiente a cada documento.
@Schema({timestamps: true, collection: 'carts',})

//la clase CartDocument extiende de Document, lo que significa que cada instancia de 
// CartDocument representará un documento en la colección de MongoDB.
export class CartDocument extends Document{
    @Prop({required: true, unique: true})
    cartId!: string;

    @Prop({required: true, index: true})
    userId!: string;

    @Prop({type: [ItemSchema], default:[]})
    items!: ItemSchema[];

    @Prop({required: true, default: 0})
    total!: number;

    @Prop({required: true, default: 'COP'})
    currency!: string;    
}

export const CartSchema = SchemaFactory.createForClass(CartDocument);


@Schema({timestamps: true, collection: 'orders',})


export class OrderDocument extends Document{
    @Prop({required: true, unique: true})
    orderId!: string;

    @Prop({required: true, index: true})
    userId!: string;

    @Prop({type: [ItemSchema], default: []})
    items!: ItemSchema[];

    @Prop({required: true, enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED',]})
    status!: string;

    @Prop({required: true})
    total!: number;

    @Prop({default: 'COP'})
    currency!: string;
    
    @Prop({type: {street: String, city: String, department: String, postalCode: String}, required: true})
    deliveryAddress!: {street: string, city: string, department: string, postalCode: string}
}

export const OrderSchema = SchemaFactory.createForClass(OrderDocument);