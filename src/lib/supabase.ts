import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Browser-safe Supabase client (uses anon key).
 * Use this in client components and public API routes.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
