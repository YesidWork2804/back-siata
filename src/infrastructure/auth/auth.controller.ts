import { Body, Controller, Post } from '@nestjs/common';
import { AuthResponse, AuthService } from '../../application/auth/auth.service';
import { LoginDto } from '../../application/auth/dto/login.dto';
import { RegisterDto } from '../../application/auth/dto/register.dto';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }
}
