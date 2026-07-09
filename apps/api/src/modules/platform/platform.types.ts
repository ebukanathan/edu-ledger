// Domain types for the platform module (Platform Admin operations).
import type { PublicRole } from '../../shared/constants/roles';

export interface OnboardSchoolInput {
  school: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    logoUrl?: string;
  };
  admin: {
    name: string;
    email: string;
  };
}

export interface SchoolDto {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface OnboardSchoolResult {
  school: SchoolDto;
  admin: { id: string; name: string; email: string; role: PublicRole };
  temporaryPassword: string;
}
