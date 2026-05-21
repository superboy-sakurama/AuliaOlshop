import { createBrowserClient } from '@supabase/ssr';

// Digunakan di Client Components (komponen React yang memiliki 'use client')
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
