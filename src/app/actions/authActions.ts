"use server";

import { createClient } from '@supabase/supabase-js';

export interface PiUserData {
  username: string;
  accessToken: string;
  uid?: string;
}

export async function registerOrLoginUser(piUser: PiUserData, referralCode: string | null) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Use warning log and early return if variables don't exist yet, avoiding crashing server action
    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn("Supabase credentials not fully configured.");
      return { success: false, error: 'Konfigurasi Supabase belum diatur di server' };
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (!piUser.uid) {
       return { success: false, error: 'UID tidak ditemukan dari profil SDK.' };
    }

    // 1. Cek apakah user dengan uid tertentu sudah ada
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, username')
      .eq('pi_uid', piUser.uid)
      .single();

    // Mengabaikan error PGGST116 (0 rows returned)
    const isNewUser = !existingUser && (checkError?.code === 'PGRST116' || checkError?.details?.includes('0 rows'));
    
    if (checkError && !isNewUser) {
      console.error('Error saat mengecek user:', checkError);
      return { success: false, error: checkError.message };
    }

    let userIdStr = '';

    if (!existingUser) {
      // 2. User baru -> Insert profil dasar
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
          { 
            pi_uid: piUser.uid, 
            username: piUser.username 
          }
        ])
        .select()
        .single();
        
      if (insertError) {
        console.error('Error saat membuat user baru:', insertError);
        return { success: false, error: insertError.message };
      }

      userIdStr = String(newUser.id);
      console.log('User baru berhasil didaftarkan:', piUser.username);

      // 3. Proses jaringan MLM Referral jika ada
      if (referralCode) {
        const { data: uplineUser } = await supabase
          .from('users')
          .select('id')
          .eq('username', referralCode)
          .single();

        if (uplineUser) {
          const { error: mlmError } = await supabase
            .from('mlm_network')
            .insert([
              { 
                upline_id: uplineUser.id, 
                downline_id: newUser.id 
              }
            ]);

          if (mlmError) {
            console.error('Gagal mencatat relasi referral (MLM):', mlmError);
          } else {
            console.log(`Relasi referral tercatat! Upline: ${referralCode}, Downline: ${piUser.username}`);
          }
        } else {
           console.warn(`Kode referal '${referralCode}' tidak ditemukan di tabel users.`);
        }
      }
    } else {
      userIdStr = String(existingUser.id);
      console.log('User lama kembali login:', existingUser.username);
    }

    return { success: true, userId: userIdStr };
  } catch (error: any) {
    console.error('Server Action registerOrLoginUser Error:', error);
    return { success: false, error: error.message };
  }
}
