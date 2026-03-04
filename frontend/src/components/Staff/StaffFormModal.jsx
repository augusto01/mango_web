import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton, Fade, Backdrop, MenuItem, Grid, CircularProgress } from '@mui/material';
import { FiX, FiUserPlus, FiLock } from 'react-icons/fi';
import { useUsers } from '../../hooks/Users/useUsers'; // Importamos tu nuevo hook

const StaffFormModal = ({ open, onClose, onSave, staffToEdit }) => {
  const { createUser, updateUser, loading } = useUsers();
  const [formData, setFormData] = useState({
    name: '', lastname: '', username: '', email: '', 
    password: '', rol: 'vendedor', cel: '', active: true
  });

  useEffect(() => {
    if (staffToEdit) {
      // Si editamos, no cargamos el password por seguridad
      setFormData({ ...staffToEdit, password: '' });
    } else {
      setFormData({ name: '', lastname: '', username: '', email: '', password: '', rol: 'vendedor', cel: '', active: true });
    }
  }, [staffToEdit, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (staffToEdit) {
        // Lógica de Modificación
        await updateUser(staffToEdit._id || staffToEdit.id, formData);
      } else {
        // Lógica de Creación
        await createUser(formData);
      }
      
      // Si la petición sale bien, ejecutamos onSave (que suele ser un refetch de la lista)
      if (onSave) onSave(); 
      onClose(); // Cerramos el modal
    } catch (err) {
      // El error ya lo captura el hook, puedes manejar alertas aquí si quieres
      console.error("Error en el formulario:", err.message);
    }
  };

  return (
    <Modal
      open={open} 
      onClose={!loading ? onClose : null} // Evita cerrar el modal mientras guarda
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500, sx: { backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0,0,0,0.85)' } } }}
    >
      <Fade in={open}>
        <Box className="modal-industrial-clean">
          <IconButton 
            onClick={onClose} 
            disabled={loading}
            sx={{ position: 'absolute', right: 10, top: 10, color: '#fff' }}
          >
            <FiX />
          </IconButton>
          
          <Box className="modal-minimal-content">
            <header style={{ textAlign: 'center', marginBottom: '25px' }}>
              <Typography className="sub-label-tech" style={{ justifyContent: 'center', color: '#FF6B00', display: 'flex', gap: '8px' }}>
                <span className={loading ? "blink" : ""}>●</span>
                {staffToEdit ? 'SYSTEM_UPDATE' : 'NEW_PROVISIONING'}
              </Typography>
              <Typography className="event-title-huge" variant="h5">
                {staffToEdit ? 'EDITAR PERSONAL' : 'ALTA DE STAFF'}
              </Typography>
            </header>

            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <Typography className="sub-label-tech"><FiUserPlus /> IDENTITY_DATA</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth margin="normal" label="NOMBRE" name="name" value={formData.name} onChange={handleChange} required disabled={loading} className="industrial-input" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth margin="normal" label="APELLIDO" name="lastname" value={formData.lastname} onChange={handleChange} required disabled={loading} className="industrial-input" />
                  </Grid>
                </Grid>
              </div>

              <div className="form-section">
                <Typography className="sub-label-tech"><FiLock /> ACCESS_&_CONTACT</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <TextField fullWidth margin="normal" label="EMAIL" name="email" value={formData.email} onChange={handleChange} type="email" required disabled={loading} className="industrial-input" />
                    <TextField fullWidth margin="normal" label="USUARIO" name="username" value={formData.username} onChange={handleChange} required disabled={loading} className="industrial-input" />
                    <TextField 
                      fullWidth 
                      margin="normal" 
                      label="CONTRASEÑA" 
                      name="password" 
                      value={formData.password} 
                      onChange={handleChange} 
                      type="password" 
                      required={!staffToEdit} 
                      placeholder={staffToEdit ? "Dejar vacío para no cambiar" : ""}
                      disabled={loading} 
                      className="industrial-input" 
                    />
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField fullWidth margin="normal" label="CELULAR" name="cel" value={formData.cel} onChange={handleChange} disabled={loading} className="industrial-input" />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField select fullWidth margin="normal" label="ROL" name="rol" value={formData.rol} onChange={handleChange} disabled={loading} className="industrial-input">
                          <MenuItem value="administrador">ADMINISTRADOR</MenuItem>
                          <MenuItem value="vendedor">VENDEDOR</MenuItem>
                          <MenuItem value="control">CONTROL</MenuItem>
                        </TextField>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </div>

              <div className="actions-footer" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <Button 
                  className="btn-mango-minimal" 
                  onClick={onClose} 
                  fullWidth 
                  disabled={loading}
                  style={{ color: '#888' }}
                >
                  CANCELAR
                </Button>
                <Button 
                  type="submit" 
                  className="btn-mango-minimal vip-btn" 
                  fullWidth 
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={20} color="inherit" /> : (staffToEdit ? 'GUARDAR' : 'CREAR ACCESO')}
                </Button>
              </div>
            </form>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default StaffFormModal;