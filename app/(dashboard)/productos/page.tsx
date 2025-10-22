import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { ProductsClient } from "@/components/products-client"

export default async function ProductosPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  // Get user profile to check if admin
  const { data: profile } = await supabase.from("user_profiles").select("is_admin").eq("id", user.id).single()

  const isAdmin = profile?.is_admin || false

  // Fetch products
  const { data: products } = await supabase.from("product").select("*").order("created_at", { ascending: false })

  return <ProductsClient products={products || []} isAdmin={isAdmin} />
}
