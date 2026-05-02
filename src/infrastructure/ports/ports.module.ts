import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortsService } from '../../application/ports/ports.service';
import { Port } from '../../domain/ports/port.entity';
import { PortsController } from './ports.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Port])],
  controllers: [PortsController],
  providers: [PortsService],
})
export class PortsModule {}
