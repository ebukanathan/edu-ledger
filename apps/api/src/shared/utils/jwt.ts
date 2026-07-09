import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../../config';
import { UnauthorizedError } from '../errors/app-error';

// Claims we embed in the access token. `sub` is the user id; schoolId + role
// are carried so most requests can authorize without an extra DB round-trip.
export interface TokenPayload {
  sub: string;
  schoolId: string | null;
  role: string;
}

export function signToken(payload: TokenPayload): string {
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, env.jwtSecret, options);
}

export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, env.jwtSecret) as TokenPayload;
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
}
