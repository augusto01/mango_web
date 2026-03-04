import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUserPlus, FaEdit, FaTrashAlt, FaArrowLeft, FaSearch, FaFilter, FaHistory, FaEnvelope 
} from 'react-icons/fa';
import { 
  Typography, IconButton, TextField, MenuItem, 
  InputAdornment, CircularProgress, Box, Fade 
} from '@mui/material';

// Componentes y Hooks
import Navbar from '../../components/Layout/Navbar';
import StaffFormModal from './StaffFormModal';
import { useUsers } from '../../hooks/Users/useUsers';

// Estilos
import '../../styles/HomeRoles.css'; 
import '../../styles/Staff.css'; 

const StaffManagement = () => {
  const navigate = useNavigate();
  
  // Custom Hook con lógica de Firebase/MongoDB
  const { users, getUsers, deleteUser, loading } = useUsers();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("todos");

  // Carga de datos inicial
  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtrado reactivo
  const filteredStaff = useMemo(() => {
    if (!users) return [];
    return users.filter(staff => {
      const fullName = `${staff.name} ${staff.lastname}`.toLowerCase();
      const matchesSearch = 
        fullName.includes(searchTerm.toLowerCase()) || 
        staff.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = filterRole === "todos" || staff.rol === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [searchTerm, filterRole, users]);

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿ESTÁ SEGURO DE ELIMINAR ESTE ACCESO? ESTA ACCIÓN ES IRREVERSIBLE.")) {
      try {
        await deleteUser(id);
        getUsers(); 
      } catch (err) {
        console.error("Error al eliminar:", err);
      }
    }
  };

  const handleOpenCreate = () => {
    setSelectedStaff(null);
    setIsModalOpen(true);
  };

  return (
    <div className="home-dashboard-wrapper staff-container">
      <Navbar />
      <div className="home-glow-bg"></div>

      <div className="container home-content-z" style={{ paddingTop: '100px' }}>
        
        {/* NAVEGACIÓN */}
        <div className="staff-navigation-top">
           <button className="btn-back-minimal" onClick={() => navigate(-1)}>
              <FaArrowLeft /> VOLVER_AL_PANEL
           </button>
        </div>

        {/* HEADER */}
        <div className="home-welcome-header">
          <div className="welcome-text-box">
            <Typography variant="h6" className="system-status">
              <span className="blink">●</span> SECURITY_LAYER // STAFF_DATABASE
            </Typography>
            <h1 className="welcome-title">GESTIÓN DE PERSONAL</h1>
          </div>
          <button className="quick-scan-btn" onClick={handleOpenCreate}>
              <FaUserPlus /> <span>NUEVO_USUARIO</span>
          </button>
        </div>

        {/* FILTROS */}
        <div className="staff-filter-bar">
          <div className="search-box-industrial">
            <TextField
              placeholder="BUSCAR POR NOMBRE, EMAIL O USUARIO..."
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaSearch style={{ color: '#FF6B00' }} />
                  </InputAdornment>
                ),
              }}
              className="industrial-input"
            />
          </div>
          <div className="filter-box-industrial">
            <TextField
              select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="industrial-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaFilter style={{ color: '#555', fontSize: '12px' }} />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="todos">TODOS LOS ROLES</MenuItem>
              <MenuItem value="administrador">ADMINISTRADORES</MenuItem>
              <MenuItem value="vendedor">VENDEDORES</MenuItem>
              <MenuItem value="control">CONTROL DE ACCESO</MenuItem>
            </TextField>
          </div>
        </div>

        {/* TABLA DE PERSONAL */}
        <div className="staff-table-wrapper mb-5">
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
              <CircularProgress sx={{ color: '#FF6B00' }} />
            </Box>
          ) : (
            <Fade in={!loading}>
              <table className="staff-table">
                <thead>
                  <tr>
                    <th>NOMBRE Y APELLIDO</th>
                    <th>USUARIO / CONTACTO</th>
                    <th>CELULAR</th>
                    <th>TIPO</th>
                    <th>CREADO_POR</th>
                    <th style={{ textAlign: 'right' }}>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map((staff) => (
                      <tr key={staff._id} className="staff-row">
                        <td className="font-readable">
                          <div className="staff-name-cell" style={{ fontWeight: 600, color: '#fff' }}>
                            {staff.name?.toUpperCase()} {staff.lastname?.toUpperCase()}
                          </div>
                          <div className="staff-id-tag mono-text">UID_{staff._id?.slice(-6).toUpperCase()}</div>
                        </td>
                        <td className="font-readable">
                          <div className="staff-user-tag" style={{ color: '#FF6B00', fontWeight: 600 }}>@{staff.username}</div>
                          <div className="staff-email-sub"><FaEnvelope style={{fontSize: '10px'}}/> {staff.email}</div>
                        </td>
                        <td className="font-readable"><span className="staff-phone-tag">{staff.cel || '---'}</span></td>
                        <td>
                          <span className={`role-badge ${staff.rol?.toLowerCase()}`}>
                            {staff.rol?.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <div className="staff-audit-cell mono-text">
                            <FaHistory style={{ marginRight: '6px', fontSize: '10px' }} /> 
                            {staff.createdBy || 'SYSTEM_ROOT'}
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="staff-actions">
                            <IconButton className="btn-action-staff edit-btn" onClick={() => handleEdit(staff)}>
                              <FaEdit />
                            </IconButton>
                            <IconButton className="btn-action-staff delete-btn" onClick={() => handleDelete(staff._id)}>
                              <FaTrashAlt />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="no-data-msg">
                        NO_RECORDS_FOUND // SIN RESULTADOS EN LA BASE DE DATOS
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Fade>
          )}
        </div>
      </div>

      <StaffFormModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        staffToEdit={selectedStaff}
        onSave={() => getUsers()} 
      />
    </div>
  );
};

export default StaffManagement;