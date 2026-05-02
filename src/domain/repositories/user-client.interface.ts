//este archivo define la interfaz IUserClient, que es un contrato para un cliente que interactúa con un servicio de usuario.
export const USER_CLIENT = 'USER_CLIENT';

//la interfaz IUserClient define los métodos que el cliente de usuario debe implementar para obtener información del usuario y sus direcciones.
export interface Address{
    addressId: string;
    street: string;
    city: string;
    department: string;
    postalCode: string;
    isDefault: boolean;
}

//la interfaz UserInfo define la estructura de la información del usuario que se espera obtener del servicio de usuario.
export interface UserInfo{
    userId: string;
    name: string;
    email: string;    
}

//la interfaz IUserClient define los métodos que el cliente de usuario debe implementar para obtener información del usuario y sus direcciones.
export interface IUserClient{
    getByUserId(userId: string): Promise<UserInfo>;

    getUserAddress(userId: string): Promise<Address[]>

    getAddressById(userId: string, addressId: string): Promise<Address>
}