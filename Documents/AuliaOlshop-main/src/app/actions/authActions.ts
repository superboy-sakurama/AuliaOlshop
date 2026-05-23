"use server";

import { createClient } from '@supabase/supabase-js';

export interface PiUserData {
  username: string;
  accessToken: string;
  uid?: string;
}

export async function registerOrLoginUser(piUser: PiUserData) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn("Supabase credentials not fully configured.");
      return { success: false, error: 'Konfigurasi Supabase belum diatur di server' };
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (!piUser.uid) {
       return { success: false, error: 'UID tidak ditemukan dari profil SDK.' };
    }

    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, username')
      .eq('pi_uid', piUser.uid)
      .single();

    const isNewUser = !existingUser && (checkError?.code === 'PGRST116' || checkError?.details?.includes('0 rows'));
    
    if (checkError && !isNewUser) {
      console.error('Error saat mengecek user:', checkError);
      return { success: false, error: checkError.message };
    }

    let userIdStr = '';

    if (!existingUser) {
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
