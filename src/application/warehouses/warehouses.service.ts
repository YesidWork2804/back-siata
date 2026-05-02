import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from '../../domain/warehouses/warehouse.entity';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehousesRepository: Repository<Warehouse>,
  ) {}

  findAll(): Promise<Warehouse[]> {
    return this.warehousesRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Warehouse> {
    const warehouse = await this.warehousesRepository.findOneBy({ id });

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    return warehouse;
  }

  async create(createWarehouseDto: CreateWarehouseDto): Promise<Warehouse> {
    const warehouse = this.warehousesRepository.create({
      name: createWarehouseDto.name.trim(),
      address: createWarehouseDto.address.trim(),
      city: createWarehouseDto.city.trim(),
      country: createWarehouseDto.country.trim(),
    });

    return this.warehousesRepository.save(warehouse);
  }

  async update(id: string, updateWarehouseDto: UpdateWarehouseDto): Promise<Warehouse> {
    const warehouse = await this.findOne(id);

    const updatedWarehouse = this.warehousesRepository.merge(warehouse, {
      name: updateWarehouseDto.name?.trim() ?? warehouse.name,
      address: updateWarehouseDto.address?.trim() ?? warehouse.address,
      city: updateWarehouseDto.city?.trim() ?? warehouse.city,
      country: updateWarehouseDto.country?.trim() ?? warehouse.country,
    });

    return this.warehousesRepository.save(updatedWarehouse);
  }

  async remove(id: string): Promise<void> {
    const warehouse = await this.findOne(id);

    await this.warehousesRepository.remove(warehouse);
  }
}
