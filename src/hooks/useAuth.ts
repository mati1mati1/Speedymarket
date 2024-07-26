// src/hooks/useAuth.ts
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useToken } from '../context/TokenContext';

const useAuth = (): string => {
  const { token, logout } = useToken();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      logout();
      router.replace('/login');
    }
  }, [token, logout, router]);

  return token || ''; 
};

export default useAuth;
