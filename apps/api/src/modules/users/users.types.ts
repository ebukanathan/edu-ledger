// Domain types for the users module (School Admin managing their own school's staff).
import type { PublicRole } from '../../shared/constants/roles';

export type CreatableRole = 'FINANCE_OFFICER' | 'TEACHER' | 'ADMISSIONS_OFFICER';

export interface CreateSchoolUserInput {
  name: string;
  email: string;
  role: CreatableRole;
}

export interface SchoolUserDto {
  id: string;
  name: string;
  email: string;
  role: PublicRole;
  createdAt: string;
}

export interface CreateSchoolUserResult {
  user: SchoolUserDto;
  temporaryPassword: string;
}
