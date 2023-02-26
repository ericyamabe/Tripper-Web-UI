import { createContext, useState } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState({});

  return <AuthContext.Provider value={(isAuthenticated, setIsAuthenticated)}>{children}</AuthContext.Provider>;
};

export default AuthContext;
