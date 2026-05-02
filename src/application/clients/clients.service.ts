import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../../domain/clients/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
  ) {}

  findAll(): Promise<Client[]> {
    return this.clientsRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientsRepository.findOneBy({ id });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const client = this.clientsRepository.create({
      fullName: createClientDto.fullName.trim(),
      documentNumber: createClientDto.documentNumber.trim(),
      email: createClientDto.email.toLowerCase().trim(),
      phone: createClientDto.phone?.trim() ?? null,
    });

    return this.clientsRepository.save(client);
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);

    const updatedClient = this.clientsRepository.merge(client, {
      fullName: updateClientDto.fullName?.trim() ?? client.fullName,
      documentNumber: updateClientDto.documentNumber?.trim() ?? client.documentNumber,
      email: updateClientDto.email?.toLowerCase().trim() ?? client.email,
      phone: updateClientDto.phone?.trim() ?? client.phone,
    });

    return this.clientsRepository.save(updatedClient);
  }

  async remove(id: string): Promise<void> {
    const client = await this.findOne(id);

    await this.clientsRepository.remove(client);
  }
}
