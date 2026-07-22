import { AdminRole } from '@prisma/client';

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: AdminRole;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
}
