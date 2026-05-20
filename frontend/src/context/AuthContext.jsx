import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("foodhub_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("foodhub_token") || null;
  });

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);

    localStorage.setItem("foodhub_user", JSON.stringify(userData));
    localStorage.setItem("foodhub_token", userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("foodhub_user");
    localStorage.removeItem("foodhub_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}