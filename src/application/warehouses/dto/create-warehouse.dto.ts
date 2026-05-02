import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateWarehouseDto {
  @ApiProperty({
    example: 'Bodega Principal Bogota',
    description: 'Warehouse name.',
    maxLength: 150,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name!: string;

  @ApiProperty({
    example: 'Calle 80 # 12-34',
    description: 'Warehouse physical address.',
    maxLength: 255,
  })
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  address!: string;

  @ApiProperty({
    example: 'Bogota',
    description: 'City where the warehouse is located.',
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  city!: string;

  @ApiProperty({
    example: 'Colombia',
    description: 'Country where the warehouse is located.',
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  country!: string;
}
