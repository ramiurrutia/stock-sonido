import useSWR from 'swr';
import { useSession } from 'next-auth/react';

export function useApi<T>(endpoint: string | null) {
  const { data: session, status } = useSession();
  
  const fetcher = async (url: string) => {
    if (!session?.user?.accessToken) {
      throw new Error('No authenticated');
    }

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`
      }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    
    return res.json();
  };

  const shouldFetch = status === 'authenticated' && endpoint && session?.user?.accessToken;

  return useSWR<T>(
    shouldFetch ? `${process.env.NEXT_PUBLIC_API_URL}${endpoint}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true, 
    }
  );
}