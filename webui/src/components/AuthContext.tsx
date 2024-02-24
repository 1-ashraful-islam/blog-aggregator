import React, { createContext, ReactNode, useContext, useState } from "react";

type AuthContextType = {
  apiKey: string;
  setApiKey: (key: string) => Promise<void>;
  isLoggedIn: boolean;
  LoginError: string;
  setLoginError: (error: string) => void;
  handleLogout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [apiKey, setApiKey] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [LoginError, setLoginError] = useState<string>("");

  // TODO: if remember me is checked, store the API key in local storage
  // Load the API key from local storage on first render
  // React.useEffect(() => {
  //   const storedApiKey = localStorage.getItem("apiKey");
  //   if (storedApiKey) {
  //     setApiKey(storedApiKey);
  //   }
  // }, []);

  const handleSetApiKey = async (key: string) => {
    try {
      const response = await fetch("http://localhost:8080/v1/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${key}`,
        },
      });

      if (!response.ok) {
        throw new Error("Invalid API key");
      }

      const data = await response.json();

      console.log(`Login is successful for user: ${data.name}`);
      setApiKey(key);
      setIsLoggedIn(true);
      setLoginError("");
      sessionStorage.setItem("apiKey", key); // Persist the API key in session storage
      //TODO: if remember me is checked, store the API key in local storage instead
      // localStorage.setItem("apiKey", key); // Persist the API key in local storage
    } catch (error) {
      console.error(error);
      setLoginError("Invalid API key");
      throw error;
    }
  };

  const handleLogout = () => {
    setApiKey("");
    setIsLoggedIn(false);
    setLoginError("");
    sessionStorage.removeItem("apiKey");
    // TODO: If implementing remember me feature
    // localStorage.removeItem("apiKey");
  };

  return (
    <AuthContext.Provider
      value={{
        apiKey,
        setApiKey: handleSetApiKey,
        handleLogout,
        isLoggedIn,
        LoginError,
        setLoginError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
