import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  const persist = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    persist(res.data);
  };

  const register = async (payload) => {
    const res = await api.post('/auth/register', payload);
    return res.data; 
  };

  const verifyRegister = async (email, otp) => {
    const res = await api.post('/auth/verify-register', { email, otp });
    persist(res.data);
  };

  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); };

  return (
    <AuthContext.Provider value={{ user, login, register, verifyRegister, logout }}>
      {children}
    </AuthContext.Provider>
  );
}