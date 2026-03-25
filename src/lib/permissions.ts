import { NextRequest } from 'next/server';
import { verifyToken } from './auth';

export function getUserFromRequest(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  return verifyToken(token);
}

export function requireRole(user: { role: string } | null, roles: string[]) {
  if (!user) throw new Error('UNAUTHORIZED');
  if (!roles.includes(user.role)) throw new Error('FORBIDDEN');
}
