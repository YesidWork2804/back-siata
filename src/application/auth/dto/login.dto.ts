import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@siata.com',
    description: 'Registered user email.',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'StrongPass123',
    minLength: 8,
    description: 'User password to validate against the stored bcrypt hash.',
  })
  @IsString()
  @MinLength(8)
  password!: string;
}
