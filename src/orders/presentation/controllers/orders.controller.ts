import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import type { Request } from 'express';
import { AddItemRequestDto } from '../dto/add-item.request.dto';
import { UpdateCartItemRequestDto } from '../dto/update-cart-item.request.dto';
import { CheckoutRequestDto } from '../dto/checkout.request.dto';
import { AddItemToCartUseCase } from 'src/orders/application/use-cases/add-item-to-cart.use-case';
import { UpdateCartUseCase } from 'src/orders/application/use-cases/update-cart.use-case';
import { CheckOutOrderUseCase } from 'src/orders/application/use-cases/checkout-order.use-case';
import { GetOrderHistoryUseCase } from 'src/orders/application/use-cases/get-order-history.use-case';
import { CancelOrderUseCase } from 'src/orders/application/use-cases/cancel-order.use-case';

@Controller('orders')
export class OrdersController{
    constructor(
    private readonly addItemToCartUseCase: AddItemToCartUseCase,
    private readonly updateCartUseCase: UpdateCartUseCase,
    private readonly checkoutOrderUseCase: CheckOutOrderUseCase,
    private readonly getOrderHistoryUseCase: GetOrderHistoryUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
    ){}

    private getUser(req: Request) {
        return (req as any).user;
    }

    private getToken(req: Request) {
        return req.headers.authorization;
    }

    @Post('cart/items')
    async addItem(@Req() req: Request, @Body() dto: AddItemRequestDto,) {
        const user = this.getUser(req);
        const cart = await this.addItemToCartUseCase.execute({userId: user.userId, ...dto,});        

        return {
        success: true,
        data: cart,
        };
    }

    @Put('cart/items')
    async updateItem(@Req() req: Request, @Body() dto: UpdateCartItemRequestDto,) {
        const user = this.getUser(req);
        const cart = await this.updateCartUseCase.execute({userId: user.userId, ...dto,});

        return cart;
    }

    @Delete('cart')
    @HttpCode(HttpStatus.OK)
    async clearCart(@Req() req: Request) {
        const user = this.getUser(req);

        await this.updateCartUseCase.clear(user.userId,);

        return {message: 'Cart cleared',};
    }

    @Post('checkout')
    async checkout(@Req() req: Request, @Body() dto: CheckoutRequestDto,) {
        const user = this.getUser(req);
        const token = this.getToken(req);

        const order = await this.checkoutOrderUseCase.execute({userId: user.userId, addressId: dto.addressId,}, token);

        return {success: true, data: order,};
    }

    @Get('history')
    async history(@Req() req: Request) {
        const user = this.getUser(req);

        return this.getOrderHistoryUseCase.execute(user.userId,);
    }

    @Get(':orderId')
    async getDetail(@Req() req: Request, @Param('orderId') orderId: string,) {
        const user = this.getUser(req);

        return this.getOrderHistoryUseCase.getDetail({userId: user.userId, orderId,});
    }

    @Delete(':orderId/cancel')
    async cancel(@Req() req: Request, @Param('orderId') orderId: string,) {
        const user = this.getUser(req);

        return this.cancelOrderUseCase.execute({userId: user.userId, orderId,});
    }
}