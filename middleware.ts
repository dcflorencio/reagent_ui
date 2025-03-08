// import { type NextRequest, NextResponse } from 'next/server'
// import { updateSession } from '@/app/utils/supabase/middleware'

// export async function middleware(request: NextRequest) {
//   console.log('Request URL:', request.nextUrl.pathname) // Log the request path
//   const session = await updateSession(request)
//   console.log('Session:', session) // Log the session status

//   if (!session) {
//     // If the user is not logged in, redirect to /login
//     if (!request.nextUrl.pathname.startsWith('/login')) {
//       const url = request.nextUrl.clone()
//       url.pathname = '/login'
//       console.log('Redirecting to /login') // Log the redirection
//       return NextResponse.redirect(url)
//     }
//   } else {
//     // If the user is logged in, redirect from /login or /signup to /
//     if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')) {
//       const url = request.nextUrl.clone()
//       url.pathname = '/'
//       console.log('Redirecting to /') // Log the redirection
//       return NextResponse.redirect(url)
//     }
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * Feel free to modify this pattern to include more paths.
//      */
//     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//   ],
// }

import { type NextRequest } from 'next/server'
import { updateSession } from '@/app/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}