import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePortDto {
  @ApiProperty({
    example: 'Puerto de Cartagena',
    description: 'Port name.',
    maxLength: 150,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name!: string;

  @ApiProperty({
    example: 'Manga Terminal Maritimo',
    description: 'Port physical address.',
    maxLength: 255,
  })
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  address!: string;

  @ApiProperty({
    example: 'Cartagena',
    description: 'City where the port is located.',
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  city!: string;

  @ApiProperty({
    example: 'Colombia',
    description: 'Country where the port is located.',
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  country!: string;
}
