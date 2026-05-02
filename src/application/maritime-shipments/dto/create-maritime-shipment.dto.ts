import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsDateString, IsInt, IsNumber, IsString, Length } from 'class-validator';

export class CreateMaritimeShipmentDto {
  @ApiProperty({ example: '1', description: 'Client identifier.' })
  @IsString()
  clientId!: string;

  @ApiProperty({ example: '1', description: 'Product identifier.' })
  @IsString()
  productId!: string;

  @ApiProperty({ example: '1', description: 'Port identifier.' })
  @IsString()
  portId!: string;

  @ApiProperty({ example: 15, description: 'Product quantity. Business rule requires value greater than 0.' })
  @Type(() => Number)
  @IsInt()
  quantity!: number;

  @ApiProperty({ example: '2026-05-02', description: 'Shipment registration date.' })
  @IsDateString()
  registrationDate!: string;

  @ApiProperty({ example: '2026-05-20', description: 'Shipment delivery date.' })
  @IsDateString()
  deliveryDate!: string;

  @ApiProperty({ example: 250000, description: 'Base shipment price.' })
  @Type(() => Number)
  @IsNumber()
  price!: number;

  @ApiProperty({
    example: 'ABC1234D',
    description: 'Fleet number. Business rule requires format /^[A-Z]{3}[0-9]{4}[A-Z]$/.',
  })
  @IsString()
  fleetNumber!: string;

  @ApiProperty({
    example: 'ZX98YU76TR',
    description: 'Unique 10-character alphanumeric shipment guide number.',
    minLength: 10,
    maxLength: 10,
  })
  @IsString()
  @IsAlphanumeric()
  @Length(10, 10)
  guideNumber!: string;
}
