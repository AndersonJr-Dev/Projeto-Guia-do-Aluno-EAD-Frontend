import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredData = async () => {
      const storedUser = localStorage.getItem("@GuiaAlunoEAD:user");
      const storedToken = localStorage.getItem("@GuiaAlunoEAD:token");

      if (storedUser && storedToken) {
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        setUser(JSON.parse(storedUser));
      }

      setLoading(false);
    };

    loadStoredData();
  }, []);

  const signIn = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, ...userData } = response.data;

      localStorage.setItem("@GuiaAlunoEAD:user", JSON.stringify(userData));
      localStorage.setItem("@GuiaAlunoEAD:token", token);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(userData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Erro ao fazer login",
      };
    }
  };

  const signUp = async (name, email, password) => {
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      const { token, ...userData } = response.data;

      localStorage.setItem("@GuiaAlunoEAD:user", JSON.stringify(userData));
      localStorage.setItem("@GuiaAlunoEAD:token", token);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(userData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Erro ao registrar usuário",
      };
    }
  };

  const signOut = () => {
    localStorage.removeItem("@GuiaAlunoEAD:user");
    localStorage.removeItem("@GuiaAlunoEAD:token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
