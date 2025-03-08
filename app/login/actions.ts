'use server'

import { redirect } from 'next/navigation'
import { createClient } from '../utils/supabase/server'
// import { Provider } from '@supabase/supabase-js'

const AuthProvider = async (provider:any) => {
    const supabase = await createClient()

    const redirectUrl = `http://116.202.210.102:3004/auth/callback`

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
        },
      })
      if (error) {
        console.error(error)
        return error
      }
      console.log(data)
      if (data.url) {
        redirect(data.url) // use the redirect API for your server framework
      }

    return data
}

const signInWithGoogle = async () => {
    return await AuthProvider('google')
}

export { signInWithGoogle }
