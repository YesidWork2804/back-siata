import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Port } from '../../domain/ports/port.entity';
import { CreatePortDto } from './dto/create-port.dto';
import { UpdatePortDto } from './dto/update-port.dto';

@Injectable()
export class PortsService {
  constructor(
    @InjectRepository(Port)
    private readonly portsRepository: Repository<Port>,
  ) {}

  findAll(): Promise<Port[]> {
    return this.portsRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Port> {
    const port = await this.portsRepository.findOneBy({ id });

    if (!port) {
      throw new NotFoundException('Port not found');
    }

    return port;
  }

  async create(createPortDto: CreatePortDto): Promise<Port> {
    const port = this.portsRepository.create({
      name: createPortDto.name.trim(),
      address: createPortDto.address.trim(),
      city: createPortDto.city.trim(),
      country: createPortDto.country.trim(),
    });

    return this.portsRepository.save(port);
  }

  async update(id: string, updatePortDto: UpdatePortDto): Promise<Port> {
    const port = await this.findOne(id);

    const updatedPort = this.portsRepository.merge(port, {
      name: updatePortDto.name?.trim() ?? port.name,
      address: updatePortDto.address?.trim() ?? port.address,
      city: updatePortDto.city?.trim() ?? port.city,
      country: updatePortDto.country?.trim() ?? port.country,
    });

    return this.portsRepository.save(updatedPort);
  }

  async remove(id: string): Promise<void> {
    const port = await this.findOne(id);

    await this.portsRepository.remove(port);
  }
}
