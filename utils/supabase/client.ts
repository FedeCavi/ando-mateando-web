import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Supabase environment variables missing:")
    console.error("[v0] NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✓ Found" : "✗ Missing")
    console.error("[v0] NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "✓ Found" : "✗ Missing")
    throw new Error("Supabase configuration is missing. Please check your environment variables.")
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export { createClient as createBrowserClient }
