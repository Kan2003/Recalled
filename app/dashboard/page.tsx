// app/dashboard/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) redirect("/login")

  return (
    <div>
      <h1>Welcome, {session.user?.name} 👋</h1>
    </div>
  )
} 