// app/login/page.tsx
import { auth, signIn } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function LoginPage() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-xl text-center space-y-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white">Welcome to Recalled</h1>
        <p className="text-gray-400 text-sm">Sign in to manage your meeting intelligence</p>

        <form action={async () => {
          "use server"
          await signIn("google", { redirectTo: "/dashboard" })
        }}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-medium py-3 px-4 rounded-xl hover:bg-gray-100 transition"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" />
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  )
}