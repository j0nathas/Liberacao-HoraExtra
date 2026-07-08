import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      loadUser,
      setUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}