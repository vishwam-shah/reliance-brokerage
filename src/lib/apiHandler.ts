import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;
  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const ApiErrors = {
  badRequest: (msg = 'Bad request', details?: unknown) => new ApiError(400, 'BAD_REQUEST', msg, details),
  unauthorized: (msg = 'Authentication required') => new ApiError(401, 'UNAUTHORIZED', msg),
  forbidden: (msg = 'Forbidden') => new ApiError(403, 'FORBIDDEN', msg),
  notFound: (msg = 'Not found') => new ApiError(404, 'NOT_FOUND', msg),
  conflict: (msg = 'Conflict') => new ApiError(409, 'CONFLICT', msg),
  tooMany: (msg = 'Too many requests', retryAfterSec?: number) =>
    new ApiError(429, 'RATE_LIMITED', msg, { retryAfterSec }),
  internal: (msg = 'Internal server error') => new ApiError(500, 'INTERNAL', msg),
};

type Handler = (req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => Promise<NextResponse> | Promise<Response>;

export function withErrorHandler(handler: Handler): Handler {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (err) {
      if (err instanceof ApiError) {
        const headers: Record<string, string> = {};
        if (err.status === 429 && err.details && typeof err.details === 'object') {
          const d = err.details as { retryAfterSec?: number };
          if (d.retryAfterSec) headers['Retry-After'] = String(d.retryAfterSec);
        }
        return NextResponse.json(
          { error: { code: err.code, message: err.message, details: err.details } },
          { status: err.status, headers }
        );
      }
      if (err instanceof ZodError) {
        return NextResponse.json(
          {
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Invalid input',
              details: err.flatten().fieldErrors,
            },
          },
          { status: 400 }
        );
      }
      console.error('[api] unhandled error:', err);
      return NextResponse.json(
        { error: { code: 'INTERNAL', message: 'Internal server error' } },
        { status: 500 }
      );
    }
  };
}

export function json<T>(data: T, init?: ResponseInit): NextResponse {
  return NextResponse.json(data, init);
}

export async function parseJson<T>(req: NextRequest): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw ApiErrors.badRequest('Invalid JSON body');
  }
}
