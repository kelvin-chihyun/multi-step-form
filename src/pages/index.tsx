import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 루트 경로 접근 시 첫 번째 단계로 리다이렉트
    router.replace('/book-review/1');
  }, [router]);

  return null;
}