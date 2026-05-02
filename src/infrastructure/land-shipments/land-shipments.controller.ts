import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateLandShipmentDto } from '../../application/land-shipments/dto/create-land-shipment.dto';
import { UpdateLandShipmentDto } from '../../application/land-shipments/dto/update-land-shipment.dto';
import { LandShipmentsService } from '../../application/land-shipments/land-shipments.service';
import { LandShipment } from '../../domain/land-shipments/land-shipment.entity';

@ApiTags('Land Shipments')
@ApiBearerAuth()
@Controller('land-shipments')
export class LandShipmentsController {
  constructor(private readonly landShipmentsService: LandShipmentsService) {}

  @Get()
  @ApiOperation({ summary: 'List all land shipments' })
  @ApiResponse({ status: 200, description: 'Land shipments listed successfully.', type: LandShipment, isArray: true })
  @ApiResponse({ status: 401, description: 'Missing or invalid JWT token.' })
  findAll(): Promise<LandShipment[]> {
    return this.landShipmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a land shipment by id' })
  @ApiResponse({ status: 200, description: 'Land shipment found.', type: LandShipment })
  @ApiResponse({ status: 401, description: 'Missing or invalid JWT token.' })
  @ApiResponse({ status: 404, description: 'Land shipment not found.' })
  findOne(@Param('id') id: string): Promise<LandShipment> {
    return this.landShipmentsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a land shipment' })
  @ApiResponse({ status: 201, description: 'Land shipment created successfully.', type: LandShipment })
  @ApiResponse({ status: 400, description: 'Invalid request body.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid JWT token.' })
  @ApiResponse({ status: 404, description: 'Client, product, or warehouse not found.' })
  @ApiResponse({ status: 422, description: 'Business rule violation.' })
  create(@Body() createLandShipmentDto: CreateLandShipmentDto): Promise<LandShipment> {
    return this.landShipmentsService.create(createLandShipmentDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a land shipment' })
  @ApiResponse({ status: 200, description: 'Land shipment updated successfully.', type: LandShipment })
  @ApiResponse({ status: 400, description: 'Invalid request body.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid JWT token.' })
  @ApiResponse({ status: 404, description: 'Land shipment, client, product, or warehouse not found.' })
  @ApiResponse({ status: 422, description: 'Business rule violation.' })
  update(
    @Param('id') id: string,
    @Body() updateLandShipmentDto: UpdateLandShipmentDto,
  ): Promise<LandShipment> {
    return this.landShipmentsService.update(id, updateLandShipmentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a land shipment' })
  @ApiResponse({ status: 200, description: 'Land shipment deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid JWT token.' })
  @ApiResponse({ status: 404, description: 'Land shipment not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.landShipmentsService.remove(id);
  }
}
