// src/hooks/useProtectedRoute.ts
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useToken } from '../context/TokenContext';

export const useProtectedRoute = () => {
  const { token } = useToken();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace('/login'); // Redirect to login if not authenticated
    }
  }, [token, router]);
};
