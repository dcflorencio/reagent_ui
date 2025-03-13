import { LoginForm } from "./Login-Form"

// 'use client'

// import { signInWithGoogle } from './actions'

// async function handleSignIn() {
//   try {
//     const data = await signInWithGoogle();
//     console.log(data)
//     // Handle successful sign-in, e.g., redirect or update UI
//   } catch (error) {
//     // Handle error, e.g., show error message
//   }
// }

// export default function LoginPage() {
//   return (
//     <form>
//       <button type="button" onClick={handleSignIn}>Log in with Google</button>
//     </form>
//   )
// }

import { GalleryVerticalEnd } from "lucide-react"

export default function LoginPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="#" className="flex items-center gap-2 font-medium">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        Reagent UI
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <LoginForm />
                    </div>
                </div>
            </div>
            <div className="relative hidden bg-muted lg:block">
                {/* <img
          src="https://cdn.pixabay.com/photo/2019/01/30/08/14/house-3963987_640.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        /> */}
                <div className="relative hidden h-full p-8 lg:block">
                    <div className="h-full w-full overflow-hidden rounded-[40px] bg-gradient-to-b from-purple-400 via-purple-600 to-black">
                        <div className="flex h-full flex-col items-center justify-center px-8 text-center text-white">
                            <div className="mb-8">
                                <h1 className="text-2xl font-semibold">Reagent UI</h1>
                            </div>
                            <h2 className="mb-6 text-4xl font-bold">Get Started with Reagent UI</h2>
                            <p className="mb-12 text-lg">To find the best properties for your needs, please follow these steps.</p>

                            <div className="w-full max-w-sm space-y-4">
                                <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                                    <div className="flex items-center gap-4">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">1</span>
                                        <span className="text-lg">Sign up your account</span>
                                    </div>
                                </div>
                                <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm">
                                    <div className="flex items-center gap-4">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
                                            2
                                        </span>
                                        <span className="text-lg">Chat with Reagent AI and tell it what you need</span>
                                    </div>
                                </div>
                                <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm">
                                    <div className="flex items-center gap-4">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
                                            3
                                        </span>
                                        <span className="text-lg">Find the best properties for your needs</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


