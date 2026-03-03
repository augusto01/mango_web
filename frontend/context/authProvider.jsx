import { createContext, useContext, useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
const AuthContext = createContext();  // ← fuera del componente



export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ isAuth: false, user: null });

  const API_URL = import.meta.env.VITE_API_URL;




  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setAuth({ isAuth: true, user: decoded });
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, []);

 const login = async (emailOrUser, password) => {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrUser, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      const error = new Error(data.message);
      error.status = res.status;  // Esto capturará el 403
      throw error;
    }

    localStorage.setItem('token', data.token);
    const decoded = jwt_decode(data.token);
    setAuth({ isAuth: true, user: decoded });
  } catch (error) {
    throw error; // Propaga el error con status
  }
};
  const logout = () => {
    localStorage.removeItem('token');
    setAuth({ isAuth: false, user: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
