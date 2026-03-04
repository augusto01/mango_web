import React, { useState, useEffect } from 'react';
import { 
  Modal, Box, Typography, TextField, Button, 
  IconButton, Fade, Backdrop, MenuItem, Grid, 
  CircularProgress, Snackbar, Alert 
} from '@mui/material';
import { FiX, FiUserPlus, FiLock, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { useUsers } from '../../hooks/Users/useUsers';
import '../../styles/Staff.css';

const StaffFormModal = ({ open, onClose, onSave, staffToEdit }) => {
  const { createUser, updateUser, loading, error } = useUsers();
  const [successOpen, setSuccessOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', lastname: '', username: '', email: '', 
    password: '', rol: 'vendedor', cel: '', active: true
  });

  useEffect(() => {
    if (staffToEdit) {
      setFormData({ ...staffToEdit, password: '' });
    } else {
      setFormData({ 
        name: '', lastname: '', username: '', email: '', 
        password: '', rol: 'vendedor', cel: '', active: true 
      });
    }
  }, [staffToEdit, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cel') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (staffToEdit) {
        await updateUser(staffToEdit._id || staffToEdit.id, formData);
      } else {
        await createUser(formData);
      }
      
      setSuccessOpen(true);
      setTimeout(() => {
        if (onSave) onSave();
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Critical Failure:", err.message);
    }
  };

  return (
    <>
      <Modal
        open={open} 
        onClose={!loading ? onClose : null}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500, sx: { backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0,0,0,0.85)' } } }}
      >
        <Fade in={open}>
          <Box className="modal-industrial-clean">
            <IconButton onClick={onClose} disabled={loading} sx={{ position: 'absolute', right: 10, top: 10, color: '#fff' }}>
              <FiX />
            </IconButton>
            
            <Box className="modal-minimal-content">
              <header style={{ textAlign: 'center' }}>
                <Typography className="sub-label-tech" style={{ justifyContent: 'center', color: '#FF6B00' }}>
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
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="NOMBRE" name="name" value={formData.name} onChange={handleChange} required disabled={loading} className="industrial-input" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="APELLIDO" name="lastname" value={formData.lastname} onChange={handleChange} required disabled={loading} className="industrial-input" />
                    </Grid>
                  </Grid>
                </div>

                <div className="form-section">
                  <Typography className="sub-label-tech"><FiLock /> ACCESS_&_CONTACT</Typography>
                  <TextField fullWidth label="EMAIL" name="email" value={formData.email} onChange={handleChange} type="email" required disabled={loading} className="industrial-input" />
                  <TextField fullWidth label="USUARIO" name="username" value={formData.username} onChange={handleChange} required disabled={loading} className="industrial-input" />
                  <TextField 
                    fullWidth label="CONTRASEÑA" name="password" value={formData.password} onChange={handleChange} 
                    type="password" required={!staffToEdit} disabled={loading} className="industrial-input" 
                    placeholder={staffToEdit ? "DEJAR VACÍO PARA NO CAMBIAR" : ""}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="CELULAR" name="cel" value={formData.cel} onChange={handleChange} disabled={loading} className="industrial-input" inputProps={{ inputMode: 'numeric' }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField select fullWidth label="ROL" name="rol" value={formData.rol} onChange={handleChange} disabled={loading} className="industrial-input">
                        <MenuItem value="administrador">ADMINISTRADOR</MenuItem>
                        <MenuItem value="vendedor">VENDEDOR</MenuItem>
                        <MenuItem value="control">CONTROL</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                </div>

                <Box className="actions-footer">
                  <Button className="btn-mango-minimal" onClick={onClose} fullWidth disabled={loading} style={{ color: '#444' }}>CANCELAR</Button>
                  <Button type="submit" className="btn-mango-minimal vip-btn" fullWidth disabled={loading}>
                    {loading ? <CircularProgress size={20} color="inherit" /> : (staffToEdit ? 'GUARDAR CAMBIOS' : 'CREAR ACCESO')}
                  </Button>
                </Box>

                {error && (
                  <Fade in={!!error}>
                    <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(255, 49, 49, 0.1)', borderLeft: '4px solid #FF3131', display: 'flex', alignItems: 'center', gap: 2 }}>
                      <FiAlertTriangle color="#FF3131" />
                      <Typography sx={{ color: '#FF3131', fontSize: '11px', fontFamily: 'JetBrains Mono' }}>CRITICAL_ERROR: {error}</Typography>
                    </Box>
                  </Fade>
                )}
              </form>
            </Box>
          </Box>
        </Fade>
      </Modal>

      <Snackbar open={successOpen} autoHideDuration={3000} onClose={() => setSuccessOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert icon={<FiCheckCircle size={20} />} severity="success" sx={{ bgcolor: '#21dd08', color: '#000', borderRadius: 0, fontWeight: 900, fontFamily: 'Syncopate' }}>
          {staffToEdit ? 'USUARIO MODIFICADO EXITOSAMENTE' : 'USUARIO CREADO EXITOSAMENTE'}
        </Alert>
      </Snackbar>
    </>
  );
};

export default StaffFormModal;