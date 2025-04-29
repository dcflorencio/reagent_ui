'use server'

import { redirect } from 'next/navigation'
import { createClient } from '../utils/supabase/server'
import { Provider } from '@supabase/supabase-js'

const AuthProvider = async (provider: Provider) => {
    const supabase = await createClient()
    const siteUrl = process.env.SITE_URL

    if (!siteUrl) {
        throw new Error('SITE_URL environment variable is not set')
    }

    const redirectUrl = `${siteUrl}/auth/callback`

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: redirectUrl,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
    })

    if (error) {
        console.error('Auth error:', error)
        throw error
    }

    if (data?.url) {
        redirect(data.url)
    }

    return data
}

const signInWithGoogle = async () => {
    return await AuthProvider('google' as Provider)
}

export { signInWithGoogle }
