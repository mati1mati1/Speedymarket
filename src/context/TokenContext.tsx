import React, { createContext, useContext, useState, ReactNode, FC } from 'react';

interface TokenContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  const logout = () => {
    setToken(null);
    sessionStorage.removeItem('token');
  };

  return (
    <TokenContext.Provider value={{ token, setToken, logout }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = (): TokenContextType => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
};
