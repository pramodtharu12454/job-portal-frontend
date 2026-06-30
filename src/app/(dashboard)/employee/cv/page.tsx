'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployerCV() {
  const router = useRouter();
  useEffect(() => { router.replace('/jobseeker/cv'); }, [router]);
  return null;
}
