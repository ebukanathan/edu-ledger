import crypto from 'crypto';

/** Cryptographically random temporary password issued on school/user onboarding. */
export function generateTemporaryPassword(length = 16): string {
  return crypto.randomBytes(length).toString('base64url').slice(0, length);
}
