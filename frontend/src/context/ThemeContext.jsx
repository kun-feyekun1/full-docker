
import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false; // SSR safety
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);
  
  const toggleTheme = () => setDarkMode((prev) => !prev);
  const setTheme = (isDark) => setDarkMode(isDark);

  const theme = {
    darkMode,
    toggleTheme,
    setTheme,
    isDark: darkMode,
    isLight: !darkMode,
    // Define colors based on theme
    colors: {
      background: darkMode ? "#1a202c" : "#ffffff",
      text: darkMode ? "#e2e8f0" : "#2d3748",
      card: darkMode ? "#2d3748" : "#f7fafc",
      surface: darkMode ? "#4a5568" : "#edf2f7",
      border: darkMode ? "#4a5568" : "#e2e8f0",
      accent: darkMode ? "#63b3ed" : "#3182ce",
      buttonBg: darkMode ? "#4299e1" : "#3182ce",
      buttonText: "#ffffff",
    },
  };
  
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Key Improvements:
// ✅ Fixed missing closing brace

// ✅ Added error handling for context

// ✅ Added persistence with localStorage

// ✅ Added system preference detection

// ✅ SSR safety check

// ✅ Added setTheme function for direct theme setting

// ✅ Added isDark/isLight convenience properties