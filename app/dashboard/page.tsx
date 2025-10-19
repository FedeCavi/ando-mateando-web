import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import DashboardClient from "@/components/dashboard-client"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", data.user.id).single()

  return <DashboardClient user={data.user} profile={profile} />
}
