import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehousesService } from '../../application/warehouses/warehouses.service';
import { Warehouse } from '../../domain/warehouses/warehouse.entity';
import { WarehousesController } from './warehouses.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Warehouse])],
  controllers: [WarehousesController],
  providers: [WarehousesService],
})
export class WarehousesModule {}
