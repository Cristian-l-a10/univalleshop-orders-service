import { InvalidOrderStateException } from "../entities/invalid-order-state.exception";

export class Money{
    public readonly amount;
    public readonly currency;

    // creamos el constructor le pasamos un objeto data
    constructor(data: {amount: number; currency?: string}){
        if(data.amount <0){
            throw new InvalidOrderStateException(
                'INVALID_AMOUNT', // estado
                'crear Money',    // acción
                'El monto no puede ser negativo');
        }

        this.amount = data.amount;
        this.currency = data.currency || 'COP';
    }

    //metodo para sumar precios de artitulos del carrito
    add(other: Money): Money{
        if(this.currency != other.currency){
            throw new InvalidOrderStateException(
                'INVALID_CURRENCY', // estado
                'Agregar pago',    // acción
                'No se pueden sumar diferentes monedas')
        }

        return new Money({amount:this.amount + other.amount, currency:this.currency});        
    }

    //metodo para sumar el precio total segun cantidad
    multiply(quantity: number): Money{
        if(quantity <0){
            throw new InvalidOrderStateException(
                'INVALID_QUANTITY', // estado
                'Agregar Cantidad',    // acción
                'La cantidad no puede ser negativa');
        }

        return new Money({amount: this.amount * quantity, currency:this.currency})
    }

    // metodo para comparar dos objetos Money y verificar si son iguales en cantidad y moneda 
    equals(other: Money): boolean{
        return(
            this.amount === other.amount && this.currency === other.currency
        );
    }
}