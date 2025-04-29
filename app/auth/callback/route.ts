import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/app/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/properties'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // In production, always redirect to the SITE_URL
      const siteUrl = process.env.SITE_URL
      if (siteUrl) {
        return NextResponse.redirect(`${siteUrl}${next}`)
      }
      
      // Fallback to origin if SITE_URL is not set
      const { origin } = new URL(request.url)
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If there's an error or no code, redirect to error page
  const { origin } = new URL(request.url)
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}