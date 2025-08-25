import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { NextURL } from 'next/dist/server/web/next-url';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const allowedOrigins = ['https://topengdev.com'];

const corsOptions = {
   'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
   'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function middleware(request: NextRequest) {
   const { host, origin, basePath, hostname, searchParams, pathname } =
      request.nextUrl;
   const requestHeaders = new Headers(request.headers);

   // Check the origin from the request
   const isAllowedOrigin = allowedOrigins.includes(origin);

   // Handle preflighted requests
   const isPreflight = request.method === 'OPTIONS';

   if (isPreflight) {
      const preflightHeaders = {
         ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
         ...corsOptions,
      };
      return NextResponse.json({}, { headers: preflightHeaders });
   }

   const getCookie = (cookieName: string) => request.cookies.get(cookieName);
   const getCookies = request.cookies.getAll;
   const hasCookie = (cookieName: string) => request.cookies.has(cookieName);
   const deleteCookie = (cookieName: string) =>
      request.cookies.delete(cookieName);

   const response = NextResponse.next();

   if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
   }

   Object.entries(corsOptions).forEach(([key, value]) => {
      response.headers.set(key, value);
   });

   return response;
}

export const config = {
   matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico, sitemap.xml, robots.txt (metadata files)
       */
      {
         source:
            '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
         missing: [
            { type: 'header', key: 'next-router-prefetch' },
            { type: 'header', key: 'purpose', value: 'prefetch' },
         ],
      },

      {
         source:
            '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
         has: [
            { type: 'header', key: 'next-router-prefetch' },
            { type: 'header', key: 'purpose', value: 'prefetch' },
         ],
      },

      {
         source:
            '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
         has: [{ type: 'header', key: 'x-present' }],
         missing: [{ type: 'header', key: 'x-missing', value: 'prefetch' }],
      },
   ],
};
