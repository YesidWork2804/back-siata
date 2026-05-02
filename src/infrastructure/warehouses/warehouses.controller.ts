import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateWarehouseDto } from '../../application/warehouses/dto/create-warehouse.dto';
import { UpdateWarehouseDto } from '../../application/warehouses/dto/update-warehouse.dto';
import { WarehousesService } from '../../application/warehouses/warehouses.service';
import { Warehouse } from '../../domain/warehouses/warehouse.entity';

@ApiTags('Warehouses')
@ApiBearerAuth()
@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Get()
  @ApiOperation({ summary: 'List all warehouses' })
  @ApiResponse({ status: 200, description: 'Warehouses listed successfully.', type: Warehouse, isArray: true })
  @ApiResponse({ status: 401, description: 'Missing or invalid JWT token.' })
  findAll(): Promise<Warehouse[]> {
    return this.warehousesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a warehouse by id' })
  @ApiResponse({ status: 200, description: 'Warehouse found.', type: Warehouse })
  @ApiResponse({ status: 401, description: 'Missing or invalid JWT token.' })
  @ApiResponse({ status: 404, description: 'Warehouse not found.' })
  findOne(@Param('id') id: string): Promise<Warehouse> {
    return this.warehousesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a warehouse' })
  @ApiResponse({ status: 201, description: 'Warehouse created successfully.', type: Warehouse })
  @ApiResponse({ status: 400, description: 'Invalid request body.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid JWT token.' })
  create(@Body() createWarehouseDto: CreateWarehouseDto): Promise<Warehouse> {
    return this.warehousesService.create(createWarehouseDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a warehouse' })
  @ApiResponse({ status: 200, description: 'Warehouse updated successfully.', type: Warehouse })
  @ApiResponse({ status: 400, description: 'Invalid request body.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid JWT token.' })
  @ApiResponse({ status: 404, description: 'Warehouse not found.' })
  update(@Param('id') id: string, @Body() updateWarehouseDto: UpdateWarehouseDto): Promise<Warehouse> {
    return this.warehousesService.update(id, updateWarehouseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a warehouse' })
  @ApiResponse({ status: 200, description: 'Warehouse deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid JWT token.' })
  @ApiResponse({ status: 404, description: 'Warehouse not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.warehousesService.remove(id);
  }
}
