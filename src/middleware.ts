import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // For now, let's disable middleware to avoid redirect loops
  // We'll handle authentication in the components themselves
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
