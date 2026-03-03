import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/authProvider';
import Navbar from './components/layout/Navbar';
import Hero from './components/home/Hero'; // Tu landing pública
import HomeAdministrador from './pages/admin/HomeAdministrador';
import HomeVendedor from './pages/staff/HomeVendedor';
import HomeConsumidor from './pages/client/HomeConsumidor';
import Login from './pages/auth/Login';

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const { isAuth, loading } = useAuth();
  if (loading) return null; // O un spinner de carga
  return isAuth ? children : <Navigate to="/login" />;
};

// --- EL "SWITCH" DE HOMES ---
const HomeRouter = () => {
  const { user } = useAuth();

  // Dependiendo del rol, retornamos un componente distinto
  switch (user?.rol?.toLowerCase()) {
    case 'administrador':
      return <HomeAdministrador />;
    case 'vendedor':
      return <HomeVendedor />;
    default:
      return <HomeConsumidor />;
  }
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Ruta Pública */}
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />

        {/* Ruta Home Protegida y Dinámica */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <HomeRouter />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;