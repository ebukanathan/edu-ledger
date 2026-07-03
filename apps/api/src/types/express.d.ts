import type { Principal } from '../modules/auth/auth.types';

// Augment Express's Request so `req.principal` is available (and typed) after
// the `authenticate` middleware has run.
declare global {
  namespace Express {
    interface Request {
      principal?: Principal;
    }
  }
}
