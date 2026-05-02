import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMaritimeShipmentDto } from '../../application/maritime-shipments/dto/create-maritime-shipment.dto';
import { UpdateMaritimeShipmentDto } from '../../application/maritime-shipments/dto/update-maritime-shipment.dto';
import { MaritimeShipmentsService } from '../../application/maritime-shipments/maritime-shipments.service';
import { MaritimeShipment } from '../../domain/maritime-shipments/maritime-shipment.entity';

@ApiTags('Maritime Shipments')
@ApiBearerAuth()
@Controller('maritime-shipments')
export class MaritimeShipmentsController {
  constructor(private readonly maritimeShipmentsService: MaritimeShipmentsService) {}

  @Get()
  @ApiOperation({ summary: 'List all maritime shipments' })
  @ApiResponse({ status: 200, description: 'Maritime shipments listed successfully.', type: MaritimeShipment, isArray: true })
  @ApiResponse({ status: 401, description: 'Missing or invalid JWT token.' })
  findAll(): Promise<MaritimeShipment[]> {
    return this.maritimeShipmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a maritime shipment by id' })
  @ApiResponse({ status: 200, description: 'Maritime shipment found.', type: MaritimeShipment })
  @ApiResponse({ status: 401, description: 'Missing or invalid JWT token.' })
  @ApiResponse({ status: 404, description: 'Maritime shipment not found.' })
  findOne(@Param('id') id: string): Promise<MaritimeShipment> {
    return this.maritimeShipmentsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a maritime shipment' })
  @ApiResponse({ status: 201, description: 'Maritime shipment created successfully.', type: MaritimeShipment })
  @ApiResponse({ status: 400, description: 'Invalid request body.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid JWT token.' })
  @ApiResponse({ status: 404, description: 'Client, product, or port not found.' })
  @ApiResponse({ status: 422, description: 'Business rule violation.' })
  create(@Body() createMaritimeShipmentDto: CreateMaritimeShipmentDto): Promise<MaritimeShipment> {
    return this.maritimeShipmentsService.create(createMaritimeShipmentDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a maritime shipment' })
  @ApiResponse({ status: 200, description: 'Maritime shipment updated successfully.', type: MaritimeShipment })
  @ApiResponse({ status: 400, description: 'Invalid request body.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid JWT token.' })
  @ApiResponse({ status: 404, description: 'Maritime shipment, client, product, or port not found.' })
  @ApiResponse({ status: 422, description: 'Business rule violation.' })
  update(
    @Param('id') id: string,
    @Body() updateMaritimeShipmentDto: UpdateMaritimeShipmentDto,
  ): Promise<MaritimeShipment> {
    return this.maritimeShipmentsService.update(id, updateMaritimeShipmentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a maritime shipment' })
  @ApiResponse({ status: 200, description: 'Maritime shipment deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid JWT token.' })
  @ApiResponse({ status: 404, description: 'Maritime shipment not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.maritimeShipmentsService.remove(id);
  }
}
