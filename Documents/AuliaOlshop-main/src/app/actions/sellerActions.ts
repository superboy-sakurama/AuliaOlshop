'use server';

/**
 * CATATAN PENGEMBANG:
 * Ini adalah contoh implementasi Next.js Server Action (app/actions/sellerActions.ts).
 * Karena Server Actions berjalan di backend secara default, Supabase Client yang diinisiasi 
 * dengan cookies akan otomatis mengamalkan RLS (Row Level Security) berdasarkan token sesi user (auth.uid()).
 * 
 * Anda tidak perlu menggunakan Service Role Key di sini.
 */

// import { createClient } from '@/utils/supabase/server'; // Memanfaatkan utility supabase server-side Next.js
import { revalidatePath } from 'next/cache';

export async function addProductAction(formData: FormData) {
  try {
    const rawData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price_pi: parseFloat(formData.get('price_pi') as string),
    };

    // Validasi sederhana
    if (!rawData.name || !rawData.price_pi) {
      throw new Error('Data produk tidak lengkap.');
    }

    /*
    const supabase = createClient();
    
    // Pastikan pengguna sudah login
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('Unauthorized');

    // Dapatkan ID Toko (Shop ID) dari pengguna yang login
    const { data: shop, error: shopError } = await supabase
      .from('shops')
      .select('id')
      .eq('owner_id', user.id)
      .single();

    if (shopError || !shop) {
      throw new Error('Toko tidak ditemukan. Anda harus membuat toko terlebih dahulu.');
    }

    // (Opsional) Logika upload file ke Supabase Storage
    const imageFile = formData.get('image') as File;
    let image_url = '';
    if (imageFile && imageFile.size > 0) {
      const fileName = `${shop.id}/${Date.now()}-${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('products')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase
        .storage
        .from('products')
        .getPublicUrl(fileName);
        
      image_url = publicUrl;
    }

    // 2. SIMPAN DATA PRODUK KE DATABASE
    // Berkat RLS (CREATE POLICY "Sellers can manage products in their shop"), 
    // operasi ini aman dan user tidak bisa memasukkan `shop_id` milik orang lain 
    // jika kita mem-filter/menetapkan `shop_id` dari kueri di atas, DAN RLS 
    // akan memblokir insert ke shop_id yang bukan miliknya.
    
    const { data, error } = await supabase
      .from('products')
      .insert({
        shop_id: shop.id,
        name: rawData.name,
        description: rawData.description,
        price_pi: rawData.price_pi,
        image_url: image_url
      });

    if (error) {
      console.error('Insert error:', error);
      throw new Error('Gagal menyimpan produk ke database.');
    }

    // Revalidasi path (Next.js cache revalidation)
    revalidatePath('/seller/products');
    revalidatePath('/');
    */

    console.log('[Server Action] Berhasil menambahkan produk ke database (Simulation)', rawData);
    
    return { success: true };
  } catch (error: any) {
    console.error('[Server Action Error]', error.message);
    return { success: false, error: error.message };
  }
}
