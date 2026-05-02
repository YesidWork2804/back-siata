import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'admin@siata.com',
    description: 'Unique email used as the account identifier.',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'StrongPass123',
    minLength: 8,
    description: 'Plain password received only during registration. It is stored as a bcrypt hash.',
  })
  @IsString()
  @MinLength(8)
  password!: string;
}
