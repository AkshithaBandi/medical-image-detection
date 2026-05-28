import { useState, useCallback } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(() => {
    const token    = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const email    = localStorage.getItem("email");
    return token ? { token, username, email } : null;
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || data.message || "Invalid email or password.");
      }
      localStorage.setItem("token",    data.access_token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("email",    data.email);
      setAuthUser({ token: data.access_token, username: data.username, email: data.email });
      return { success: true };
    } catch (err) {
      const msg = err.message.includes("Failed to fetch")
        ? "Cannot connect to server. Is FastAPI running?"
        : err.message;
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || data.message || "Registration failed.");
      }
      return { success: true };
    } catch (err) {
      const msg = err.message.includes("Failed to fetch")
        ? "Cannot connect to server. Is FastAPI running?"
        : err.message;
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    setAuthUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{ user: authUser, loading, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}