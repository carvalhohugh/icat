import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that are protected (require login)
const PROTECTED_PREFIXES = ['/admin', '/professor', '/beneficiario'];

// Routes always accessible without login
const PUBLIC_PREFIXES = [
  '/login',
  '/pesquisa',        // external survey links
  '/entrevistador',   // interviewer PWA (has own login)
  '/api',
  '/_next',
  '/favicon.ico',
  '/logo.png',
  '/manifest.json',
  '/',                // public site
  '/cursos',
  '/doacoes',
  '/sobre',
  '/quem-somos',
  '/clube-de-vantagens',
  '/matricula',
  '/cadastro',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(p => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // Check for session cookie (set by Supabase or our mock login)
  const sessionCookie =
    request.cookies.get('sb-access-token') ||
    request.cookies.get('supabase-auth-token') ||
    request.cookies.get('icat-session');

  if (!sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|logo.png|manifest.json|icons/).*)',
  ],
};
