import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import type { ICatalogClient } from "src/orders/domain/repositories/catalog-client.interface";
import { ProductInfo } from "src/orders/domain/repositories/catalog-client.interface";
import { InvalidOrderStateException } from "src/orders/domain/entities/invalid-order-state.exception";

@Injectable()
export class HttpCatalogClient implements ICatalogClient{
    private readonly baseUrl;

    constructor(
        private readonly http: HttpService,
        private readonly config: ConfigService
    ){
        this.baseUrl = this.config.get<string>('API_GATEWAY_URL',) || 'http://api-gateway:3000';
    }

    async getProductId(productId: string): Promise<ProductInfo> {
        try{
            const response = await firstValueFrom(this.http.get(`${this.baseUrl}/catalog/products/${productId}`));
            return response.data
        }catch(error: any){
            this.handleError(error,'Producto no encontrado',);
        }
    }

    async validateStock(productId: string, quantity: number): Promise<boolean> {
        try{
            const response = await firstValueFrom(this.http.get(`${this.baseUrl}/catalog/products/${productId}/stock?quantity=${quantity}`));
            return response.data.available;
        }catch(error: any){
            this.handleError(error,'No fue posible validar stock',);
        }
    }

    async decrementStock(productId: string, quantity: number): Promise<void> {
        try{
            await firstValueFrom(this.http.patch(`${this.baseUrl}/catalog/products/${productId}/stock/decrement`, {quantity}));
        }catch(error: any){
            this.handleError(error,'No fue posible descontar stock',);
        }
    }

    async restoreStock(productId: string, quantity: number): Promise<void> {
        try{
        await firstValueFrom(this.http.patch(`${this.baseUrl}/catalog/products/${productId}/stock/restore`,
          { quantity }));
        }catch(error: any){
            this.handleError(error,'No fue posible restaurar stock');
        }
    }
    
    private handleError(error: any, message: string): never{
        if(error.response){
            if(error.response.status === 404){
                throw new Error(message);
            }
            throw new Error(`Gateway respondió con error ${error.response.status}`);
        }        

        throw new Error('Servicio de catálogo no disponible',);
    }
}