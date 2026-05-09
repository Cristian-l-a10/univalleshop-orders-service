//este archivo define la interfaz ICatalogClient, que es un contrato para un cliente que interactúa con un servicio de catálogo.
export const CATALOG_CLIENT = 'CATALOG_CLIENT';

//la interfaz ProductInfo define la estructura de la información del producto que se espera obtener del servicio de catálogo.
export interface ProductInfo{
    productId: string;
    name: string;
    price: number;
    availableStock: number;
}

//la interfaz ICatalogClient define los métodos que el cliente de catálogo debe implementar para obtener información del producto, validar el stock, y gestionar el stock.
export interface ICatalogClient{
    getProductId(productId: string): Promise<ProductInfo>;

    validateStock(productId: string, quantity: number): Promise <boolean>;

    decrementStock(productId: string, quantity: number): Promise<void>;

    restoreStock(productId: string, quantity: number): Promise<void>;
}