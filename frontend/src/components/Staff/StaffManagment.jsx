import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUserPlus, FaUserShield, FaEdit, FaTrashAlt, FaArrowLeft, FaSearch, FaFilter 
} from 'react-icons/fa';
import { Typography, LinearProgress, IconButton, TextField, MenuItem, InputAdornment } from '@mui/material';
import Navbar from '../../components/Layout/Navbar';
import StaffFormModal from './StaffFormModal';
import '../../styles/HomeRoles.css'; 
import '../../styles/Staff.css'; 

const StaffManagement = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  
  // Estados para Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("todos");

  // Datos mockeados extendidos
  const [staffList, setStaffList] = useState([
    { id: 1, name: "Lucas Gomez", username: "lucas_staff", role: "admin", status: "activo", phone: "11 2233-4455" },
    { id: 2, name: "Maria Becerra", username: "maria_ventas", role: "vendedor", status: "activo", phone: "11 5566-7788" },
    { id: 3, name: "Jorge Rojas", username: "jorge_qr", role: "control", status: "inactivo", phone: "11 9900-1122" },
  ]);

  // Lógica de Filtrado Dinámico
  const filteredStaff = useMemo(() => {
    return staffList.filter(staff => {
      const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            staff.username.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === "todos" || staff.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [searchTerm, filterRole, staffList]);

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  return (
    <div className="home-dashboard-wrapper staff-container">
      <Navbar />
      <div className="home-glow-bg"></div>

      <div className="container home-content-z" style={{ paddingTop: '100px' }}>
        
        <div className="staff-navigation-top">
           <button className="btn-back-minimal" onClick={() => navigate(-1)}>
              <FaArrowLeft /> VOLVER_AL_PANEL
           </button>
        </div>

        <div className="home-welcome-header">
          <div className="welcome-text-box">
            <Typography variant="h6" className="system-status">
              <span className="blink">●</span> SECURITY_LAYER // STAFF_MANAGEMENT
            </Typography>
            <h1 className="welcome-title">GESTIÓN DE PERSONAL</h1>
          </div>
          <button className="quick-scan-btn" onClick={() => { setSelectedStaff(null); setIsModalOpen(true); }}>
              <FaUserPlus /> <span>NUEVO_USUARIO</span>
          </button>
        </div>

        {/* BARRA DE BÚSQUEDA Y FILTROS */}
        <div className="staff-filter-bar">
          <div className="search-box-industrial">
            <TextField
              placeholder="BUSCAR POR NOMBRE O USUARIO..."
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
              <MenuItem value="admin">ADMINISTRADORES</MenuItem>
              <MenuItem value="vendedor">VENDEDORES</MenuItem>
              <MenuItem value="control">CONTROL DE ACCESO</MenuItem>
            </TextField>
          </div>
        </div>

        {/* TABLA INDUSTRIAL ACTUALIZADA */}
        <div className="staff-table-wrapper mb-5">
          <table className="staff-table">
            <thead>
              <tr>
                <th>NOMBRE Y APELLIDO</th>
                <th>USERNAME</th>
                <th>CELULAR</th>
                <th>TIPO USUARIO</th>
                <th>ESTADO</th>
                <th style={{ textAlign: 'right' }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length > 0 ? (
                filteredStaff.map((staff) => (
                  <tr key={staff.id} className="staff-row">
                    <td>
                      <div className="staff-name-cell">{staff.name.toUpperCase()}</div>
                      <div className="staff-id-tag">ID_{staff.id.toString().padStart(3, '0')}</div>
                    </td>
                    <td><span className="staff-user-tag">@{staff.username}</span></td>
                    <td><span className="staff-phone-tag">{staff.phone}</span></td>
                    <td><span className={`role-badge ${staff.role}`}>{staff.role}</span></td>
                    <td>
                      <div className="status-indicator">
                        <span className={staff.status === 'activo' ? 'dot-active' : 'dot-inactive'}></span>
                        {staff.status}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="staff-actions">
                        <IconButton className="btn-action-staff" onClick={() => handleEdit(staff)}>
                          <FaEdit />
                        </IconButton>
                        <IconButton className="btn-action-staff btn-delete">
                          <FaTrashAlt />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '50px', color: '#444' }}>
                    NO SE ENCONTRARON RESULTADOS BAJO ESTOS PARÁMETROS // 404_NOT_FOUND
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <StaffFormModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        staffToEdit={selectedStaff}
        onSave={(data) => console.log("Guardando:", data)}
      />
    </div>
  );
};

export default StaffManagement;