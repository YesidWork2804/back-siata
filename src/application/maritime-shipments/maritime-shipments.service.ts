import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Client } from '../../domain/clients/client.entity';
import { MaritimeShipment } from '../../domain/maritime-shipments/maritime-shipment.entity';
import { Port } from '../../domain/ports/port.entity';
import { Product } from '../../domain/products/product.entity';
import { CreateMaritimeShipmentDto } from './dto/create-maritime-shipment.dto';
import { UpdateMaritimeShipmentDto } from './dto/update-maritime-shipment.dto';

@Injectable()
export class MaritimeShipmentsService {
  private readonly fleetNumberPattern = /^[A-Z]{3}[0-9]{4}[A-Z]$/;

  constructor(
    @InjectRepository(MaritimeShipment)
    private readonly maritimeShipmentsRepository: Repository<MaritimeShipment>,
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Port)
    private readonly portsRepository: Repository<Port>,
  ) {}

  findAll(): Promise<MaritimeShipment[]> {
    return this.maritimeShipmentsRepository.find({
      relations: {
        client: true,
        product: true,
        port: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<MaritimeShipment> {
    const shipment = await this.maritimeShipmentsRepository.findOne({
      where: { id },
      relations: {
        client: true,
        product: true,
        port: true,
      },
    });

    if (!shipment) {
      throw new NotFoundException('Maritime shipment not found');
    }

    return shipment;
  }

  async create(createMaritimeShipmentDto: CreateMaritimeShipmentDto): Promise<MaritimeShipment> {
    await this.validateBusinessRules(createMaritimeShipmentDto);
    await this.ensureGuideNumberIsUnique(createMaritimeShipmentDto.guideNumber);

    const client = await this.findClient(createMaritimeShipmentDto.clientId);
    const product = await this.findProduct(createMaritimeShipmentDto.productId);
    const port = await this.findPort(createMaritimeShipmentDto.portId);
    const discountPrice = this.calculateDiscountPrice(
      createMaritimeShipmentDto.quantity,
      createMaritimeShipmentDto.price,
    );

    const shipment = this.maritimeShipmentsRepository.create({
      client,
      clientId: client.id,
      product,
      productId: product.id,
      port,
      portId: port.id,
      quantity: createMaritimeShipmentDto.quantity,
      registrationDate: createMaritimeShipmentDto.registrationDate,
      deliveryDate: createMaritimeShipmentDto.deliveryDate,
      price: this.formatMoney(createMaritimeShipmentDto.price),
      discountPrice: this.formatMoney(discountPrice),
      fleetNumber: createMaritimeShipmentDto.fleetNumber,
      guideNumber: createMaritimeShipmentDto.guideNumber,
    });

    return this.maritimeShipmentsRepository.save(shipment);
  }

  async update(
    id: string,
    updateMaritimeShipmentDto: UpdateMaritimeShipmentDto,
  ): Promise<MaritimeShipment> {
    const shipment = await this.findOne(id);
    const nextQuantity = updateMaritimeShipmentDto.quantity ?? shipment.quantity;
    const nextPrice = updateMaritimeShipmentDto.price ?? Number(shipment.price);
    const nextGuideNumber = updateMaritimeShipmentDto.guideNumber ?? shipment.guideNumber;
    const nextFleetNumber = updateMaritimeShipmentDto.fleetNumber ?? shipment.fleetNumber;

    await this.validateBusinessRules({
      quantity: nextQuantity,
      fleetNumber: nextFleetNumber,
    });

    if (updateMaritimeShipmentDto.guideNumber) {
      await this.ensureGuideNumberIsUnique(nextGuideNumber, id);
    }

    const client = updateMaritimeShipmentDto.clientId
      ? await this.findClient(updateMaritimeShipmentDto.clientId)
      : shipment.client;
    const product = updateMaritimeShipmentDto.productId
      ? await this.findProduct(updateMaritimeShipmentDto.productId)
      : shipment.product;
    const port = updateMaritimeShipmentDto.portId
      ? await this.findPort(updateMaritimeShipmentDto.portId)
      : shipment.port;
    const discountPrice = this.calculateDiscountPrice(nextQuantity, nextPrice);

    const updatedShipment = this.maritimeShipmentsRepository.merge(shipment, {
      client,
      clientId: client.id,
      product,
      productId: product.id,
      port,
      portId: port.id,
      quantity: nextQuantity,
      registrationDate: updateMaritimeShipmentDto.registrationDate ?? shipment.registrationDate,
      deliveryDate: updateMaritimeShipmentDto.deliveryDate ?? shipment.deliveryDate,
      price: this.formatMoney(nextPrice),
      discountPrice: this.formatMoney(discountPrice),
      fleetNumber: nextFleetNumber,
      guideNumber: nextGuideNumber,
    });

    return this.maritimeShipmentsRepository.save(updatedShipment);
  }

  async remove(id: string): Promise<void> {
    const shipment = await this.findOne(id);

    await this.maritimeShipmentsRepository.remove(shipment);
  }

  private async validateBusinessRules(input: {
    quantity: number;
    fleetNumber: string;
  }): Promise<void> {
    if (input.quantity <= 0) {
      throw new UnprocessableEntityException('Quantity must be greater than 0');
    }

    if (!this.fleetNumberPattern.test(input.fleetNumber)) {
      throw new UnprocessableEntityException('Fleet number must match format ABC1234D');
    }
  }

  private async ensureGuideNumberIsUnique(guideNumber: string, ignoredId?: string): Promise<void> {
    const existingShipment = await this.maritimeShipmentsRepository.findOne({
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

  private async findPort(id: string): Promise<Port> {
    const port = await this.portsRepository.findOneBy({ id });

    if (!port) {
      throw new NotFoundException('Port not found');
    }

    return port;
  }

  private calculateDiscountPrice(quantity: number, price: number): number {
    return quantity > 10 ? price * 0.97 : price;
  }

  private formatMoney(value: number): string {
    return value.toFixed(2);
  }
}
