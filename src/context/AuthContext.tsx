import React, { createContext, useContext, useState, ReactNode, FC, useEffect } from 'react';
import { login as loginApi } from 'src/api/auth';
import * as SecureStore from "expo-secure-store";
import axios from 'axios';
import { decodedToken } from 'src/utils/authUtils';
import { Role } from 'src/models';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import customAlert from 'src/components/AlertComponent';

export interface LoginResponse {
  success: boolean;
  role: Role | null;
}

interface AuthProps {
  authState: { token: string | null; role: Role | null; authenticated: boolean };
  onRegister?: (username: string, password: string) => void;
  onLogin: (username: string, password: string) => Promise<LoginResponse>;
  onLogout: () => Promise<any>;
}

const AuthContext = createContext<AuthProps | undefined>(undefined);
const TOKEN_KEY = 'token';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export const getToken = async () => {
  let token;
  if (Platform.OS === 'web') {
    token = await AsyncStorage.getItem(TOKEN_KEY);
  }
  else{
    token = await SecureStore.getItemAsync(TOKEN_KEY);
  }
  if (!token) {
    console.error('Token not found');
    router.replace('/login'); 
    customAlert('Authentication error', 'Please log in again.');
    return null;
  }
  return token;
    
}

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<{ token: string | null; role: Role | null; authenticated: boolean }>({
    token: null,
    role: null,
    authenticated: false,
  });

  useEffect(() => {
    const loadToken = async () => {
      let token;
      if (Platform.OS === 'web') {
        token = await AsyncStorage.getItem(TOKEN_KEY);
      }
      else{
        token = await SecureStore.getItemAsync(TOKEN_KEY);
      }
      console.log('Token:', token);
      if (token) {
        const userRole = decodedToken(token)?.role;
        setAuthState({ token, role: userRole || null, authenticated: true });
        axios.defaults.headers['Authorization'] = `Bearer ${token}`;
      }
    };
    loadToken();
  }, []);

  const register = async (username: string, password: string) => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token) {
      const userRole = decodedToken(token)?.role;
      setAuthState({ token, role: userRole || null, authenticated: true });
    }
  };

  const login = async (username: string, password: string): Promise<LoginResponse> => {
    const response = await loginApi(username, password);
    if (response.success) {
      const userRole = decodedToken(response.token)?.role;
      setAuthState({ token: response.token, role: userRole || null, authenticated: true });
      axios.defaults.headers['Authorization'] = `Bearer ${response.token}`;
      if (Platform.OS === 'web') {
        await AsyncStorage.setItem(TOKEN_KEY, response.token);
      }
      else{
        await SecureStore.setItemAsync(TOKEN_KEY, response.token);
      }
      return { success: true, role: userRole || null };
    }
    return { success: false, role: null };
  };

  const logout = async () => {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
    else{
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }    setAuthState({ token: null, role: null, authenticated: false });
  };

  const value = {
    authState,
    onRegister: register,
    onLogin: login,
    onLogout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
