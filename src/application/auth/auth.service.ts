import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../../domain/users/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

export interface AuthResponse {
  access_token: string;
  token_type: 'Bearer';
}

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const normalizedEmail = registerDto.email.toLowerCase().trim();
    const existingUser = await this.usersRepository.findOneBy({ email: normalizedEmail });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, this.saltRounds);
    const user = this.usersRepository.create({
      email: normalizedEmail,
      nombre: normalizedEmail,
      password: passwordHash,
      rol: 'user',
    });

    const savedUser = await this.usersRepository.save(user);

    return this.signToken(savedUser);
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const normalizedEmail = loginDto.email.toLowerCase().trim();
    const user = await this.usersRepository.findOneBy({ email: normalizedEmail });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signToken(user);
  }

  private async signToken(user: User): Promise<AuthResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      token_type: 'Bearer',
    };
  }
}
