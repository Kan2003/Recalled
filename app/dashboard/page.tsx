// app/dashboard/page.tsx
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()

  console.log(session)

  if (!session) redirect("/login")

  return <DashboardShell />;
} 

