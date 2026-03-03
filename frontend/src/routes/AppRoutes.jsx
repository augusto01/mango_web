import { Routes, Route } from 'react-router-dom';
import Index from '../components/Index';
import Login from '../components/Login';
import MisDatos from '../components/MisDatos';
import PrivateRoute from '../routes/PrivateRoutes';
import Productos from '../components/Productos/Products';

// Importamos los nuevos Homes
import HomeAdministrador from '../components/Homes/HomeAdministrador';
import HomeVendedor from '../components/Homes/HomeVendedor';
import HomeConsumidor from '../components/Homes/HomeConsumidor';
import { useAuth } from '../../context/authProvider';

// Componente Selector de Home según Rol
const HomeRouter = () => {
  const { user } = useAuth();

  switch (user?.rol?.toLowerCase()) {
    case 'administrador':
      return <HomeAdministrador />;
    case 'vendedor':
      return <HomeVendedor />;
    default:
      return <HomeConsumidor />;
  }
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas */}
      <Route element={<PrivateRoute />}>
        {/* Ahora /home renderiza el Router de Roles */}
        <Route path="/home" element={<HomeRouter />} />
        
        <Route path="/mis-datos" element={<MisDatos />} />
        <Route path="/productos" element={<Productos />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;