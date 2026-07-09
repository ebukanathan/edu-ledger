// User domain types live in the shared contract package.
export type { User, UserRole, CreatableSchoolRole } from '@eduledger/shared';

export interface CreateSchoolUserResponse {
  user: import('@eduledger/shared').User;
  temporaryPassword: string;
}
