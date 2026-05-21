/**
 * CATATAN UNTUK PENGEMBANG:
 * File ini adalah contoh implementasi Next.js App Router (Server Components) 
 * dikombinasikan dengan @supabase/ssr seperti permintaan arsitektur Anda. 
 * 
 * Karena lingkungan workspace AI Studio ini menggunakan React (Vite SPA) 
 * untuk menampilkan Live Preview secara real-time, kita tidak bisa langsung
 * me-render file Server Component ini. Namun kode ini merupakan template solid 
 * yang bisa langsung Anda pindahkan ke framework Next.js Anda.
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * 1. Fungsi utilitas membuat koneksi Supabase di sisi server
 * Lokasi ideal (Next.js): src/utils/supabase/server.ts 
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Ditangkap ketika mencoba men-set cookie di Server Component
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Ditangkap ketika mencoba men-set cookie di Server Component
          }
        },
      },
    }
  );
}

/**
 * 2. Contoh File Page untuk Keranjang (Server Component)
 * Lokasi ideal (Next.js): app/cart/page.tsx
 */
/*
import { createClient } from '@/utils/supabase/server';
import CartUI from '@/components/CartUI'; // Komponen keranjang klien (mirip dengan yg dibuat di CartPage.tsx)

export default async function Page() {
  const supabase = createClient();

  // Mendapatkan sesi user saat ini
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Redireksi atau lempar error jika tidak ada sesi
    return <div>Silakan login terlebih dahulu</div>;
  }

  // Mengambil item keranjang, menggabungkannya dengan tabel produk
  const { data: cartItems, error } = await supabase
    .from('cart')
    .select(`
      id,
      quantity,
      products (
        id,
        name,
        price_pi,
        image_url,
        store_name
      )
    `)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching cart:', error);
    return <div>Gagal memuat keranjang</div>;
  }

  // Passing data ke Client Component untuk interaksi keranjang
  return (
    <main>
       <CartUI initialCartItems={cartItems} />
    </main>
  );
}
*/
