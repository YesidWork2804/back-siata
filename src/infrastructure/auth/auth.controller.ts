import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponse, AuthService } from '../../application/auth/auth.service';
import { AuthResponseDto } from '../../application/auth/dto/auth-response.dto';
import { LoginDto } from '../../application/auth/dto/login.dto';
import { RegisterDto } from '../../application/auth/dto/register.dto';
import { Public } from './public.decorator';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({
    status: 201,
    description: 'User registered and JWT token returned.',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid request body.' })
  @ApiResponse({ status: 422, description: 'Email already registered or business rule violated.' })
  register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Authenticate an existing user' })
  @ApiResponse({
    status: 201,
    description: 'Credentials validated and JWT token returned.',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid request body.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }
}
