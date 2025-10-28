import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('ella_hub_token'));

  useEffect(() => {
    if (token) {
      verificarToken();
    } else {
      setLoading(false);
    }
  }, [token]);

  const verificarToken = async () => {
    try {
      const response = await ApiService.buscarDiagnostico(token);
      if (response.success) {
        setUsuario(response.usuario);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (tokenInput) => {
    try {
      setLoading(true);
      const response = await ApiService.login(tokenInput);
      
      if (response.success) {
        setUsuario(response.usuario);
        setToken(tokenInput);
        localStorage.setItem('ella_hub_token', tokenInput);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem('ella_hub_token');
  };

  const value = {
    usuario,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!usuario,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

