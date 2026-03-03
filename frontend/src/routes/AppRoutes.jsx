import { Routes, Route } from 'react-router-dom';
import Index from '../components/Index';
import Login from '../components/Login';
import Home from '../components/Home';
import MisDatos from '../components/MisDatos';
import PrivateRoute from '../routes/PrivateRoutes';
import Productos from '../components/Productos/Products';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas */}
      <Route element={<PrivateRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/mis-datos" element={<MisDatos />} />
        <Route path="/productos" element={<Productos />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
