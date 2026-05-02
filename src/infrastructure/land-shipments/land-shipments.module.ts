import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandShipmentsService } from '../../application/land-shipments/land-shipments.service';
import { Client } from '../../domain/clients/client.entity';
import { LandShipment } from '../../domain/land-shipments/land-shipment.entity';
import { Product } from '../../domain/products/product.entity';
import { Warehouse } from '../../domain/warehouses/warehouse.entity';
import { LandShipmentsController } from './land-shipments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LandShipment, Client, Product, Warehouse])],
  controllers: [LandShipmentsController],
  providers: [LandShipmentsService],
})
export class LandShipmentsModule {}
