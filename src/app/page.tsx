"use client"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const tokenExists = localStorage.getItem('token');
    if (tokenExists) {
      router.replace('/dashboard');
    }
  }, [router]);

  return (
    <>

    </>
  );
}
