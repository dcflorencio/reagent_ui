"use client"

import type React from "react"

import { useState } from "react"
import { GalleryVerticalEnd } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { signInWithGoogle } from '@/app/login/actions'

async function handleGoogleLogin() {
  try {
    const data = await signInWithGoogle();
    console.log(data)
    // Handle successful sign-in, e.g., redirect or update UI
  } catch (error) {
    // Handle error, e.g., show error message
  }
}
export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [isLoading, setIsLoading] = useState(false)

//   const handleGoogleLogin = () => {
//     setIsLoading(true)
//     // Simulate API call
//     setTimeout(() => {
//       setIsLoading(false)
//       // In a real app, this would redirect to Google OAuth
//       alert("Google login initiated!")
//     }, 1500)
//   }

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
            className="group relative w-full overflow-hidden rounded-lg border-2 p-6 transition-all hover:border-primary hover:shadow-lg"
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

