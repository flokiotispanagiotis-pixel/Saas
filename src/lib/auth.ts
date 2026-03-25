import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function authenticate(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;
  const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  return { user, token };
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { sub: number; role: 'ADMIN' | 'STAFF' };
  } catch {
    return null;
  }
}
