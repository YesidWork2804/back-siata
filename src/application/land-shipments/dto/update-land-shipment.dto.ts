import { PartialType } from '@nestjs/swagger';
import { CreateLandShipmentDto } from './create-land-shipment.dto';

export class UpdateLandShipmentDto extends PartialType(CreateLandShipmentDto) {}
