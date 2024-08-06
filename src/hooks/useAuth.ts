import { useEffect, useState } from 'react';
import { useRouter, useRootNavigationState } from 'expo-router';
import { useToken } from '../context/TokenContext';

const useAuth = (): string => {
  const { token, logout } = useToken();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (rootNavigationState?.key && !token) {
      setIsReady(true);
    }
  }, [rootNavigationState, token]);

  useEffect(() => {
    if (isReady && !token) {
      logout();
      router.replace('/login');
    }
  }, [isReady, token, logout, router]);

  return token || ''; 
};

export default useAuth;
