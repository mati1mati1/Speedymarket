import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  role: 'customer' | 'manager';
  username: string;
}

interface UserContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
  }

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  debugger;
  const context = useContext(UserContext);
  if (!context) {
    return { user: null, setUser: () => {}, logout: () => {} };
  }
  return context;
};

export { UserContext };
