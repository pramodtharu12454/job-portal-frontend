'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import JobPostForm from '@/components/JobPostForm';

function PostJobPage() {
  const searchParams = useSearchParams();
  const editId = searchParams.get('id') || undefined;
  return <JobPostForm editId={editId} redirectTo="/jobseeker/my-jobs" />;
}

export default function PostJob() {
  return <Suspense><PostJobPage /></Suspense>;
}
