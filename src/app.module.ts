import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './infrastructure/auth/auth.module';
import { JwtAuthGuard } from './infrastructure/auth/jwt-auth.guard';
import { ClientsModule } from './infrastructure/clients/clients.module';
import { validateEnvironment } from './infrastructure/config/env.validation';
import { createTypeOrmOptions } from './infrastructure/database/typeorm.config';
import { LandShipmentsModule } from './infrastructure/land-shipments/land-shipments.module';
import { PortsModule } from './infrastructure/ports/ports.module';
import { ProductsModule } from './infrastructure/products/products.module';
import { WarehousesModule } from './infrastructure/warehouses/warehouses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvironment,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: createTypeOrmOptions,
      inject: [ConfigService],
    }),
    AuthModule,
    ClientsModule,
    ProductsModule,
    WarehousesModule,
    PortsModule,
    LandShipmentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
