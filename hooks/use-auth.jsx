  // hooks/use-auth.js
  "use client";

  import { createContext, useContext, useEffect, useState } from "react";

  const AuthContext = createContext();

  export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is logged in on initial load
    useEffect(() => {
      const checkAuthStatus = async () => {
        setIsLoading(true);
        try {
          const response = await fetch("/api/auth/me");
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            setUser(null);
          }
        } catch (err) {
          console.error("Auth check error:", err);
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      };

      checkAuthStatus();
    }, []);

    // Register function
    const register = async (userData) => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Registration failed");
        }

        // Login after successful registration
        await login({
          email: userData.email,
          password: userData.password
        });
        
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    };

    // Login function
    const login = async (credentials) => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Login failed");
        }

        setUser(data.user);
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    };

    // Logout function
    const logout = async () => {
      setIsLoading(true);
      
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
        });
        
        setUser(null);
      } catch (err) {
        console.error("Logout error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Refresh user data
    const refreshUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Error refreshing user:", err);
      }
    };

    return (
      <AuthContext.Provider
        value={{
          user,
          isLoading,
          error,
          login,
          register,
          logout,
          refreshUser,
          isAuthenticated: !!user
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  };
  