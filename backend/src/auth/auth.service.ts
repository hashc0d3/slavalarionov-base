import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';

export type JwtPayload = { sub: number; email: string; role: Role };

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private getGoogleClient(): OAuth2Client {
    if (!this.googleClient) {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      if (!clientId) {
        throw new UnauthorizedException('GOOGLE_CLIENT_ID is not configured');
      }
      this.googleClient = new OAuth2Client(clientId);
    }
    return this.googleClient;
  }

  async verifyGoogleTokenAndGetEmail(idToken: string): Promise<string> {
    const client = this.getGoogleClient();
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const email = payload?.email;
      if (!email) {
        throw new UnauthorizedException('Google token does not contain email');
      }
      return email;
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  async loginWithGoogle(idToken: string): Promise<{ accessToken: string; user: { id: number; email: string; role: Role } }> {
    const email = await this.verifyGoogleTokenAndGetEmail(idToken);

    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await this.prisma.user.create({
        data: { email, role: Role.USER },
      });
    }

    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async findUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true },
    });
  }
}
