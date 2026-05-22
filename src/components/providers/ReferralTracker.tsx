"use client";

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function Tracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      localStorage.setItem('pendingReferral', ref);
      console.log('Kode referral berhasil ditangkap dan disimpan:', ref);
    }
  }, [searchParams]);

  return null;
}

export default function ReferralTracker() {
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  );
}
