import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import type { IUserClient } from "src/orders/domain/repositories/user-client.interface";
import { UserInfo, Address } from "src/orders/domain/repositories/user-client.interface";

@Injectable()
export class HttpUserClient implements IUserClient{
    private readonly baseUrl: string;
    constructor(
        private readonly http: HttpService,
        private readonly config: ConfigService
    ){
        this.baseUrl = this.config.get<string>('API_GATEWAY_URL',) || 'http://api-gateway:3000'
    }

    async getByUserId(userId: string, token?: string): Promise<UserInfo>{
        const response = await firstValueFrom(this.http.get(`${this.baseUrl}/users/${userId}`,{headers: this.buildHeaders(token),}));
        return response.data;
    }

    async getUserAddress(userId: string, token?: string): Promise<Address[]> {
        const response = await firstValueFrom(this.http.get( `${this.baseUrl}/users/${userId}/addresses`,{headers: this.buildHeaders(token),}));
        return response.data
    }

    async getAddressById(userId: string, addressId: string, token?: string): Promise<Address> {
        const response = await firstValueFrom(this.http.get(`${this.baseUrl}/users/${userId}/addresses/${addressId}`,{headers: this.buildHeaders(token),}));
        return response.data;
    }

    private buildHeaders(token?: string){
        if(!token) return {};

        return{
            Authorization: `Bearer ${token}`,
        };
    }
}