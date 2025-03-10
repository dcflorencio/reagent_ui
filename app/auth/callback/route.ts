import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/app/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  console.log("request in callback", request)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  console.log("searchParams in callback", searchParams)
  const next = searchParams.get('next') ?? '/'
  console.log("next in callback", next)
  if (code) {
    console.log("code in callback", code)
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    console.log("error in callback", error)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      console.log("forwardedHost in callback", forwardedHost)
      const isLocalEnv = process.env.NODE_ENV === 'development'
      console.log("isLocalEnv in callback", isLocalEnv)
      if (isLocalEnv) {
        console.log("origin in callback", origin)
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        console.log("forwardedHost", `https://${forwardedHost}${next}`)
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
        
      } else {
        console.log("origin", `${origin}${next}`)
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  console.log("redirecting to error page", `${origin}/auth/auth-code-error`)
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}