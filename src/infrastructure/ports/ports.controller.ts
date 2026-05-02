import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePortDto } from '../../application/ports/dto/create-port.dto';
import { UpdatePortDto } from '../../application/ports/dto/update-port.dto';
import { PortsService } from '../../application/ports/ports.service';
import { Port } from '../../domain/ports/port.entity';

@ApiTags('Ports')
@ApiBearerAuth()
@Controller('ports')
export class PortsController {
  constructor(private readonly portsService: PortsService) {}

  @Get()
  @ApiOperation({ summary: 'List all ports' })
  @ApiResponse({ status: 200, description: 'Ports listed successfully.', type: Port, isArray: true })
  @ApiResponse({ status: 401, description: 'Missing or invalid JWT token.' })
  findAll(): Promise<Port[]> {
    return this.portsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a port by id' })
  @ApiResponse({ status: 200, description: 'Port found.', type: Port })
  @ApiResponse({ status: 401, description: 'Missing or invalid JWT token.' })
  @ApiResponse({ status: 404, description: 'Port not found.' })
  findOne(@Param('id') id: string): Promise<Port> {
    return this.portsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a port' })
  @ApiResponse({ status: 201, description: 'Port created successfully.', type: Port })
  @ApiResponse({ status: 400, description: 'Invalid request body.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid JWT token.' })
  create(@Body() createPortDto: CreatePortDto): Promise<Port> {
    return this.portsService.create(createPortDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a port' })
  @ApiResponse({ status: 200, description: 'Port updated successfully.', type: Port })
  @ApiResponse({ status: 400, description: 'Invalid request body.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid JWT token.' })
  @ApiResponse({ status: 404, description: 'Port not found.' })
  update(@Param('id') id: string, @Body() updatePortDto: UpdatePortDto): Promise<Port> {
    return this.portsService.update(id, updatePortDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a port' })
  @ApiResponse({ status: 200, description: 'Port deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid JWT token.' })
  @ApiResponse({ status: 404, description: 'Port not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.portsService.remove(id);
  }
}
