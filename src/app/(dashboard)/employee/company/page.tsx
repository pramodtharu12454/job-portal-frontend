'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployeeCompany() {
  const router = useRouter();
  useEffect(() => { router.replace('/jobs'); }, [router]);
  return null;
}
