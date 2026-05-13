import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("rescueai_token");
    const storedUser = localStorage.getItem("rescueai_user");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const parsedUser = storedUser ? JSON.parse(storedUser) : {};
        setUser({ ...decoded, ...parsedUser, token });
      } catch (err) {
        localStorage.removeItem("rescueai_token");
        localStorage.removeItem("rescueai_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("rescueai_token", data.token);
    localStorage.setItem("rescueai_user", JSON.stringify(data.user));
    setUser({ ...data.user, token: data.token });
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    localStorage.setItem("rescueai_token", data.token);
    localStorage.setItem("rescueai_user", JSON.stringify(data.user));
    setUser({ ...data.user, token: data.token });
  };

  const logout = () => {
    localStorage.removeItem("rescueai_token");
    localStorage.removeItem("rescueai_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
