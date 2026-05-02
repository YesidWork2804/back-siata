import { PartialType } from '@nestjs/swagger';
import { CreateMaritimeShipmentDto } from './create-maritime-shipment.dto';

export class UpdateMaritimeShipmentDto extends PartialType(CreateMaritimeShipmentDto) {}
