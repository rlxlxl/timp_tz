import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import prisma from './prisma';

const AUTH_SECRET = process.env.AUTH_SECRET || 'dev_secret_change_me';
const SESSION_COOKIE_NAME = 'session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function parseCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';').map((item) => item.trim());
  const found = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return found ? decodeURIComponent(found.split('=')[1]) : null;
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string | null | undefined) {
  if (!storedHash) return false;
  const [salt, derived] = storedHash.split(':');
  if (!salt || !derived) return false;
  const hash = scryptSync(password, salt, 64).toString('hex');
  return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derived, 'hex'));
}

export function createSessionToken(userId: number) {
  const timestamp = Date.now();
  const payload = `${userId}:${timestamp}`;
  const signature = createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  const expected = createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
  const safeSignature = Buffer.from(signature, 'hex');
  const safeExpected = Buffer.from(expected, 'hex');
  if (safeSignature.length !== safeExpected.length) return null;
  if (!timingSafeEqual(safeSignature, safeExpected)) return null;

  const [idStr, createdAtStr] = payload.split(':');
  const userId = Number(idStr);
  const createdAt = Number(createdAtStr);
  if (!userId || Number.isNaN(createdAt)) return null;
  if (Date.now() - createdAt > SESSION_MAX_AGE * 1000) return null;
  return userId;
}

export async function getCurrentUserBySession(sessionToken: string | undefined) {
  const userId = verifySessionToken(sessionToken);
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}

export async function getCurrentUser(req: Request) {
  const cookieHeader = req.headers.get('cookie');
  const sessionToken = parseCookieValue(cookieHeader, SESSION_COOKIE_NAME);

  if (sessionToken) {
    const user = await getCurrentUserBySession(sessionToken);
    if (user) return user;
  }

  const url = new URL(req.url);
  const email = url.searchParams.get('userEmail') ?? req.headers.get('x-user-email');
  if (!email) return null;
  return prisma.user.findUnique({ where: { email } });
}

export async function requireUser(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}
