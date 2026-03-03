// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/authProvider';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Login from './components/Login';
import Index from './components/Index';

// Estilos globales
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import { ProtectedRoute } from './components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Solo Admin y Vendedor pueden ver el Home/Dashboard */}
      <Route 
        path="/home" 
        element={
          <ProtectedRoute allowedRoles={['administrador', 'vendedor']}>
            <Home />
          </ProtectedRoute>
        } 
      />

      {/* Rutas exclusivas de Administrador */}
      <Route 
        path="/usuarios" 
        element={
          <ProtectedRoute allowedRoles={['administrador']}>
            <Usuarios />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};