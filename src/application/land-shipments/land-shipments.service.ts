import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Client } from '../../domain/clients/client.entity';
import { LandShipment } from '../../domain/land-shipments/land-shipment.entity';
import { Product } from '../../domain/products/product.entity';
import { Warehouse } from '../../domain/warehouses/warehouse.entity';
import { CreateLandShipmentDto } from './dto/create-land-shipment.dto';
import { UpdateLandShipmentDto } from './dto/update-land-shipment.dto';

@Injectable()
export class LandShipmentsService {
  private readonly vehiclePlatePattern = /^[A-Z]{3}[0-9]{3}$/;

  constructor(
    @InjectRepository(LandShipment)
    private readonly landShipmentsRepository: Repository<LandShipment>,
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Warehouse)
    private readonly warehousesRepository: Repository<Warehouse>,
  ) {}

  findAll(): Promise<LandShipment[]> {
    return this.landShipmentsRepository.find({
      relations: {
        client: true,
        product: true,
        warehouse: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<LandShipment> {
    const shipment = await this.landShipmentsRepository.findOne({
      where: { id },
      relations: {
        client: true,
        product: true,
        warehouse: true,
      },
    });

    if (!shipment) {
      throw new NotFoundException('Land shipment not found');
    }

    return shipment;
  }

  async create(createLandShipmentDto: CreateLandShipmentDto): Promise<LandShipment> {
    await this.validateBusinessRules(createLandShipmentDto);
    await this.ensureGuideNumberIsUnique(createLandShipmentDto.guideNumber);

    const client = await this.findClient(createLandShipmentDto.clientId);
    const product = await this.findProduct(createLandShipmentDto.productId);
    const warehouse = await this.findWarehouse(createLandShipmentDto.warehouseId);
    const discountPrice = this.calculateDiscountPrice(
      createLandShipmentDto.quantity,
      createLandShipmentDto.price,
    );

    const shipment = this.landShipmentsRepository.create({
      client,
      clientId: client.id,
      product,
      productId: product.id,
      warehouse,
      warehouseId: warehouse.id,
      quantity: createLandShipmentDto.quantity,
      registrationDate: createLandShipmentDto.registrationDate,
      deliveryDate: createLandShipmentDto.deliveryDate,
      price: this.formatMoney(createLandShipmentDto.price),
      discountPrice: this.formatMoney(discountPrice),
      vehiclePlate: createLandShipmentDto.vehiclePlate,
      guideNumber: createLandShipmentDto.guideNumber,
    });

    return this.landShipmentsRepository.save(shipment);
  }

  async update(id: string, updateLandShipmentDto: UpdateLandShipmentDto): Promise<LandShipment> {
    const shipment = await this.findOne(id);
    const nextQuantity = updateLandShipmentDto.quantity ?? shipment.quantity;
    const nextPrice = updateLandShipmentDto.price ?? Number(shipment.price);
    const nextGuideNumber = updateLandShipmentDto.guideNumber ?? shipment.guideNumber;
    const nextVehiclePlate = updateLandShipmentDto.vehiclePlate ?? shipment.vehiclePlate;

    await this.validateBusinessRules({
      quantity: nextQuantity,
      vehiclePlate: nextVehiclePlate,
    });

    if (updateLandShipmentDto.guideNumber) {
      await this.ensureGuideNumberIsUnique(nextGuideNumber, id);
    }

    const client = updateLandShipmentDto.clientId
      ? await this.findClient(updateLandShipmentDto.clientId)
      : shipment.client;
    const product = updateLandShipmentDto.productId
      ? await this.findProduct(updateLandShipmentDto.productId)
      : shipment.product;
    const warehouse = updateLandShipmentDto.warehouseId
      ? await this.findWarehouse(updateLandShipmentDto.warehouseId)
      : shipment.warehouse;
    const discountPrice = this.calculateDiscountPrice(nextQuantity, nextPrice);

    const updatedShipment = this.landShipmentsRepository.merge(shipment, {
      client,
      clientId: client.id,
      product,
      productId: product.id,
      warehouse,
      warehouseId: warehouse.id,
      quantity: nextQuantity,
      registrationDate: updateLandShipmentDto.registrationDate ?? shipment.registrationDate,
      deliveryDate: updateLandShipmentDto.deliveryDate ?? shipment.deliveryDate,
      price: this.formatMoney(nextPrice),
      discountPrice: this.formatMoney(discountPrice),
      vehiclePlate: nextVehiclePlate,
      guideNumber: nextGuideNumber,
    });

    return this.landShipmentsRepository.save(updatedShipment);
  }

  async remove(id: string): Promise<void> {
    const shipment = await this.findOne(id);

    await this.landShipmentsRepository.remove(shipment);
  }

  private async validateBusinessRules(input: {
    quantity: number;
    vehiclePlate: string;
  }): Promise<void> {
    if (input.quantity <= 0) {
      throw new UnprocessableEntityException('Quantity must be greater than 0');
    }

    if (!this.vehiclePlatePattern.test(input.vehiclePlate)) {
      throw new UnprocessableEntityException('Vehicle plate must match format ABC123');
    }
  }

  private async ensureGuideNumberIsUnique(guideNumber: string, ignoredId?: string): Promise<void> {
    const existingShipment = await this.landShipmentsRepository.findOne({
      where: ignoredId ? { guideNumber, id: Not(ignoredId) } : { guideNumber },
    });

    if (existingShipment) {
      throw new UnprocessableEntityException('Guide number already exists');
    }
  }

  private async findClient(id: string): Promise<Client> {
    const client = await this.clientsRepository.findOneBy({ id });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  private async findProduct(id: string): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  private async findWarehouse(id: string): Promise<Warehouse> {
    const warehouse = await this.warehousesRepository.findOneBy({ id });

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    return warehouse;
  }

  private calculateDiscountPrice(quantity: number, price: number): number {
    return quantity > 10 ? price * 0.95 : price;
  }

  private formatMoney(value: number): string {
    return value.toFixed(2);
  }
}
