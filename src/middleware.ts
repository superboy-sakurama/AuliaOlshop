import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // CATATAN PANDUAN PENGEMBANG (DEVELOPER NOTE):
  // Ini adalah simulasi dari Middleware Supabase RLS untuk Pi Network dApp
  //
  // Dalam production:
  // 1. Saat `registerOrLoginUser` (Server Action) sukses dipanggil, set HttpOnly Cookie
  //    (contoh: `adminSession=eyJhbG...`)
  // 2. Di dalam middleware ini, baca cookie tersebut:
  //    const session = request.cookies.get('adminSession');
  // 3. Verifikasi role session tersebut ke tabel Supabase (atau JWT payload).
  // 4. Jika role bukan 'admin', lakukan redirect.
  
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // const adminToken = request.cookies.get('adminSession');
    // if (!adminToken || isNotAdmin(adminToken)) {
    //   return NextResponse.redirect(new URL('/?unauthorized=true', request.url));
    // }
    
    // Akses diizinkan (bypass untuk preview saat ini)
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  // Hanya jalankan middleware untuk route yang berawalan /admin
  matcher: ['/admin/:path*'],
};
