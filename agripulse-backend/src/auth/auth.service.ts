import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { LoginDto } from './dto/login.dto';
import { AccessTokenPayload, AuthUser } from './types/auth.types';

const BCRYPT_SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private toPublicUser(user: {
    id: string;
    email: string;
    fullName: string;
    role: AuthUser['role'];
  }): AuthUser {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };
  }

  async login(dto: LoginDto): Promise<{ accessToken: string; user: AuthUser }> {
    const user = await this.prisma.adminUser.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: this.toPublicUser(user),
    };
  }

  async me(userId: string): Promise<AuthUser> {
    const user = await this.prisma.adminUser.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid or inactive session');
    }

    return this.toPublicUser(user);
  }

  async createAdminUser(dto: CreateAdminUserDto): Promise<{
    id: string;
    email: string;
    fullName: string;
    role: AuthUser['role'];
    isActive: boolean;
    createdAt: Date;
  }> {
    const email = dto.email.toLowerCase();

    const existing = await this.prisma.adminUser.findUnique({
      where: { email },
    });

    if (existing) {
      throw new ConflictException(
        'An admin user with this email already exists',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);

    const user = await this.prisma.adminUser.create({
      data: {
        email,
        passwordHash,
        fullName: dto.fullName,
        role: dto.role,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return user;
  }
}
