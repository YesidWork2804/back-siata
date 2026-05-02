import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({
    example: 'Mariana Gomez',
    description: 'Client full legal or commercial name.',
    maxLength: 150,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  fullName!: string;

  @ApiProperty({
    example: '1020304050',
    description: 'Unique client document or tax identification number.',
    maxLength: 50,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  documentNumber!: string;

  @ApiProperty({
    example: 'mariana.gomez@example.com',
    description: 'Unique client email.',
    maxLength: 150,
  })
  @IsEmail()
  @MaxLength(150)
  email!: string;

  @ApiPropertyOptional({
    example: '+573001112233',
    description: 'Client contact phone.',
    maxLength: 30,
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;
}
