import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    // Variables de entorno globales
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Conexión a MongoDB usando ConfigService
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),

    // Módulo principal de órdenes
    OrdersModule,
  ],
})
export class AppModule {}