export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly isOperational = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') { super(404, message); }
}

export class ValidationError extends AppError {
  constructor(message = 'Invalid input') { super(400, message); }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') { super(401, message); }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') { super(403, message); }
}
