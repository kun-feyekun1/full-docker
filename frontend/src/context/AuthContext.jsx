import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api/apiClient";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const TOKEN_KEY = "token";
const USER_KEY = "userData";

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTimeout, setRefreshTimeout] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      scheduleTokenRefresh(storedToken);
    }
    setLoading(false);
  }, []);

  // Decode JWT and schedule token refresh
  const scheduleTokenRefresh = useCallback((token) => {
    if (!token) return;

    const decoded = jwtDecode(token);
    const expiresIn = decoded.exp * 1000 - Date.now();

    // Auto logout if expired
    if (expiresIn <= 0) {
      logout();
      return;
    }

    // Schedule token refresh 1 minute before expiry
    if (refreshTimeout) clearTimeout(refreshTimeout);
    const timeoutId = setTimeout(() => refreshToken(), Math.max(0, expiresIn - 60_000));
    setRefreshTimeout(timeoutId);
  }, [refreshTimeout]);

  // Login
  const login = async (email, password) => {
    try {
      const result = await api.post("/auth/login", { email, password });
      if (!result.token) return { success: false, message: result.message || "Login failed" };

      localStorage.setItem(TOKEN_KEY, result.token);
      const userData = result.user || { email, name: email.split("@")[0] };
      localStorage.setItem(USER_KEY, JSON.stringify(userData));

      setToken(result.token);
      setUser(userData);

      scheduleTokenRefresh(result.token);

      return { success: true, message: result.message };
    } catch (err) {
      console.error("Login error", err);
      return { success: false, message: err.message };
    }
  };

  // Register
  const register = async (userData) => {
    try {
      const result = await api.post("/auth/register", userData);
      if (!result.token) return { success: false, message: result.message || "Registration failed" };

      localStorage.setItem(TOKEN_KEY, result.token);
      localStorage.setItem(USER_KEY, JSON.stringify(result.user));

      setToken(result.token);
      setUser(result.user);

      scheduleTokenRefresh(result.token);

      return { success: true, message: result.message };
    } catch (err) {
      console.error("Registration error", err);
      return { success: false, message: err.message };
    }
  };

  // Logout
  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout"); // token auto-attached
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setToken(null);
      setUser(null);
      if (refreshTimeout) clearTimeout(refreshTimeout);
      navigate("/login");
    }
  }, [navigate, refreshTimeout]);

  // Refresh token
  const refreshToken = async () => {
    try {
      const result = await api.post("/auth/refresh"); // returns new token
      if (result.token) {
        localStorage.setItem(TOKEN_KEY, result.token);
        setToken(result.token);
        scheduleTokenRefresh(result.token);
      } else {
        logout();
      }
    } catch (err) {
      console.error("Token refresh failed", err);
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => useContext(AuthContext);


// docker exec -it agrimon_nginx sh 
// / # cat /etc/nginx/nginx.conf

