import { useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/api";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  // Initialize the state for the localStorage
  const [user, setUser] = useState(() => {
    // Checking token if exists
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Checking expiration token
        if (decoded.exp * 1000 > Date.now()) {
          return decoded;
        }
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
    return null;
  });

  const updateUserFromToken = useCallback((newToken) => {
    if (newToken) {
      try {
        setUser(jwtDecode(newToken));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post(
        "/auth",
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      const { token, refresh_token } = response.data;
      localStorage.setItem("token", token);

      if (refresh_token) {
        localStorage.setItem("refresh_token", refresh_token);
      }

      updateUserFromToken(token);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message,
      };
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  }, []);

  /**
   * Check if user has one or many roles
   * @param {string|string[]} roles
   */
  const hasRole = useCallback(
    (roles) => {
      if (!user?.roles || !roles) return false;

      if (Array.isArray(roles)) {
        return roles.some((role) => user.roles.includes(role));
      }

      return user.roles.includes(roles);
    },
    [user],
  );

  const value = {
    user,
    login,
    logout,
    hasRole,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
