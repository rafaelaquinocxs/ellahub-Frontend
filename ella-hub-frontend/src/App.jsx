import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import LeadCapture from './pages/LeadCapture';
import LandingPage from './pages/LandingPage';
import CriarTeste from './pages/CriarTeste';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminDiagnosticoDetalhe from './pages/AdminDiagnosticoDetalhe';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/lead-capture" element={<LeadCapture />} />
            <Route path="/criar-teste" element={<CriarTeste />} />
            
            {/* Rotas protegidas */}
            <Route 
              path="/painel" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Rotas administrativas */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/diagnostico/:id" element={<AdminDiagnosticoDetalhe />} />
            <Route path="/admin-old" element={<Admin />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

