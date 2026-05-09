import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { CartDocument, OrderDocument } from './infrastructure/persistence/order.schema';
import { MongoOrderRepository } from './infrastructure/persistence/mongo-order.repository';
import { HttpCatalogClient } from './infrastructure/persistence/http-catalog.client';
import { HttpUserClient } from './infrastructure/persistence/http-user.client';
import { ORDER_RESPOSITORY } from './domain/repositories/order-repository.interface';
import { CATALOG_CLIENT } from './domain/repositories/catalog-client.interface';
import { USER_CLIENT } from './domain/repositories/user-client.interface';
import { AddItemToCartUseCase } from './application/use-cases/add-item-to-cart.use-case';
import { UpdateCartUseCase } from './application/use-cases/update-cart.use-case';
import { CheckOutOrderUseCase } from './application/use-cases/checkout-order.use-case';
import { GetOrderHistoryUseCase } from './application/use-cases/get-order-history.use-case';
import { CancelOrderUseCase } from './application/use-cases/cancel-order.use-case';
import { OrdersController } from './presentation/controllers/orders.controller';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: CartDocument.name, schema: CartDocument },
      { name: OrderDocument.name, schema: OrderDocument },
    ]),
  ],
  controllers: [OrdersController],
  providers: [

    {
      provide: ORDER_RESPOSITORY,
      useClass: MongoOrderRepository,
    },
    
    {
      provide: CATALOG_CLIENT,
      useClass: HttpCatalogClient,
    },
    {
      provide: USER_CLIENT,
      useClass: HttpUserClient,
    },

    // Casos de uso
    AddItemToCartUseCase,
    UpdateCartUseCase,
    CheckOutOrderUseCase,
    GetOrderHistoryUseCase,
    CancelOrderUseCase,
  ],
})

export class OrdersModule{}