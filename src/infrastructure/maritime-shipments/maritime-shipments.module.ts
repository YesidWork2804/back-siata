import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaritimeShipmentsService } from '../../application/maritime-shipments/maritime-shipments.service';
import { Client } from '../../domain/clients/client.entity';
import { MaritimeShipment } from '../../domain/maritime-shipments/maritime-shipment.entity';
import { Port } from '../../domain/ports/port.entity';
import { Product } from '../../domain/products/product.entity';
import { MaritimeShipmentsController } from './maritime-shipments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MaritimeShipment, Client, Product, Port])],
  controllers: [MaritimeShipmentsController],
  providers: [MaritimeShipmentsService],
})
export class MaritimeShipmentsModule {}
