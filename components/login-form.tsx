// 'use client'
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { signInWithGoogle } from '@/app/login/actions'

// async function handleSignIn() {
//   try {
//     const data = await signInWithGoogle();
//     console.log(data)
//     // Handle successful sign-in, e.g., redirect or update UI
//   } catch (error) {
//     // Handle error, e.g., show error message
//   }
// }
// export function LoginForm({
//   className,
//   ...props
// }: React.ComponentPropsWithoutRef<"form">) {
//   return (
//     <form className={cn("flex flex-col gap-6", className)} {...props}>
//       <div className="flex flex-col items-center gap-2 text-center">
//         <h1 className="text-2xl font-bold">Login to your account</h1>
//         <p className="text-balance text-sm text-muted-foreground">
//           Enter your email below to login to your account
//         </p>
//       </div>
//       <div className="grid gap-6">
//         <div className="grid gap-2">
//           <Label htmlFor="email">Email</Label>
//           <Input id="email" type="email" placeholder="m@example.com" required />
//         </div>
//         <div className="grid gap-2">
//           <div className="flex items-center">
//             <Label htmlFor="password">Password</Label>
//             <a
//               href="#"
//               className="ml-auto text-sm underline-offset-4 hover:underline"
//             >
//               Forgot your password?
//             </a>
//           </div>
//           <Input id="password" type="password" required />
//         </div>
//         <Button type="submit" className="w-full">
//           Login
//         </Button>
//         <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
//           <span className="relative z-10 bg-background px-2 text-muted-foreground">
//             Or continue with
//           </span>
//         </div>
//         <Button variant="outline" className="w-full" onClick={handleSignIn}>
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//             <path
//               d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
//               fill="currentColor"
//             />
//           </svg>
//           Login with Google
//         </Button>
//       </div>
//       <div className="text-center text-sm">
//         Don&apos;t have an account?{" "}
//         <a href="#" className="underline underline-offset-4">
//           Sign up
//         </a>
//       </div>
//     </form>
//   )
// }


"use client"

import type React from "react"

import { useState } from "react"
import { GalleryVerticalEnd } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { signInWithGoogle } from '@/app/login/actions'


export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [isLoading, setIsLoading] = useState(false)
  async function handleGoogleLogin() {
    setIsLoading(true)
    try {
      const data = await signInWithGoogle();
      console.log(data)
      // Handle successful sign-in, e.g., redirect or update UI
    } catch (error) {
      // Handle error, e.g., show error message
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-4">
          <a href="#" className="flex flex-col items-center gap-2 font-medium transition-transform hover:scale-105">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-8" />
            </div>
            <span className="sr-only">Reagent UI</span>
          </a>
          <h1 className="text-2xl font-bold">Welcome to Reagent UI</h1>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <a href="#" className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80">
              Sign up
            </a>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center">
          <Button
            variant="outline"
            className="group relative w-full overflow-hidden rounded-lg border-2 p-6 transition-all hover:border-primary hover:shadow-lg hover:bg-primary/10 cursor-pointer"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="relative flex items-center justify-center gap-3">
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-5">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
              )}
              <span className="text-base font-medium">{isLoading ? "Connecting..." : "Continue with Google"}</span>
            </div>
          </Button>
        </div>
      </div>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}

