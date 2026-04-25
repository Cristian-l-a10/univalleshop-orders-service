// aqui definimos los posibles estados de una orden y las reglas de transición entre ellos. Esto nos permite controlar el flujo de una orden a lo largo de su ciclo de vida, asegurando que solo se realicen transiciones válidas entre estados. Por ejemplo, una orden no puede pasar directamente de "PENDING" a "SHIPPED" sin antes pasar por "PROCESSING".
export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

export class OrderStatusVO {
    // el valor de status es inmutable, una vez creado el objeto no se puede cambiar su estado, para cambiar el estado se debe crear un nuevo objeto con el nuevo estado
    public readonly status: OrderStatus;

    // el constructor recibe un estado inicial para la orden, que debe ser uno de los valores definidos en el enum OrderStatus. Este estado inicial se asigna a la propiedad status del objeto OrderStatusVO.
    constructor(status: OrderStatus) {
        this.status = status;
    }

    // el método canTransitionTo recibe un nuevo estado (newStatus) y verifica si la transición desde el estado actual (this.status) al nuevo estado es válida según las reglas definidas. Por ejemplo, una orden en estado "PENDING" solo puede pasar a "PROCESSING" o "CANCELLED", mientras que una orden en estado "PROCESSING" solo puede pasar a "SHIPPED". Si la transición es válida, el método devuelve true; de lo contrario, devuelve false.
    canTransitionTo(newStatus: OrderStatus): boolean {
        // Definimos las reglas de transición entre estados de la orden según el estado actual (this.status) y el nuevo estado (newStatus) que se desea alcanzar.
        if (this.status === OrderStatus.PENDING){
            return(
                newStatus === OrderStatus.PROCESSING || newStatus === OrderStatus.CANCELLED
            );
        }

        if(this.status === OrderStatus.PROCESSING){
            return newStatus === OrderStatus.SHIPPED
        }

        if(this.status === OrderStatus.SHIPPED){
            return newStatus === OrderStatus.DELIVERED
        }

        if(this.status === OrderStatus.DELIVERED || this.status === OrderStatus.CANCELLED){
            return false;
        }

        return false;
    }
}