import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token used to authenticate protected requests.',
  })
  access_token!: string;

  @ApiProperty({
    example: 'Bearer',
    description: 'Token type expected in the Authorization header.',
  })
  token_type!: 'Bearer';
}
