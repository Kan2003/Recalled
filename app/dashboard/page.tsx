// app/dashboard/page.tsx
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { redirect } from "next/navigation";

export default async function DashboardPage() {

  return <DashboardShell />;
}

