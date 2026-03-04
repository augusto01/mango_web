import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton, Fade, Backdrop, MenuItem, Grid } from '@mui/material';
import { FiX, FiUserPlus, FiLock } from 'react-icons/fi';

const StaffFormModal = ({ open, onClose, onSave, staffToEdit }) => {
  const [formData, setFormData] = useState({
    name: '', lastname: '', username: '', email: '', 
    password: '', rol: 'vendedor', cel: '', active: true
  });

  useEffect(() => {
    if (staffToEdit) {
      setFormData({ ...staffToEdit, password: '' });
    } else {
      setFormData({ name: '', lastname: '', username: '', email: '', password: '', rol: 'vendedor', cel: '', active: true });
    }
  }, [staffToEdit, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Modal
      open={open} onClose={onClose} closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500, sx: { backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0,0,0,0.85)' } } }}
    >
      <Fade in={open}>
        <Box className="modal-industrial-clean">
          <IconButton onClick={onClose} sx={{ position: 'absolute', right: 10, top: 10, color: '#fff' }}><FiX /></IconButton>
          
          <Box className="modal-minimal-content">
            <header style={{ textAlign: 'center', marginBottom: '25px' }}>
              <Typography className="sub-label-tech" style={{ justifyContent: 'center', color: '#FF6B00' }}>
                {staffToEdit ? 'SYSTEM_UPDATE' : 'NEW_PROVISIONING'}
              </Typography>
              <Typography className="event-title-huge" variant="h5">
                {staffToEdit ? 'EDITAR PERSONAL' : 'ALTA DE STAFF'}
              </Typography>
            </header>

            <form onSubmit={(e) => { e.preventDefault(); onSave(formData); onClose(); }}>
              <div className="form-section">
                <Typography className="sub-label-tech"><FiUserPlus /> IDENTITY_DATA</Typography>
                <Grid container>
                  <Grid item xs={12}>
                    <TextField fullWidth margin="normal" label="NOMBRE" name="name" value={formData.name} onChange={handleChange} required className="industrial-input" />
                    <TextField fullWidth margin="normal" label="APELLIDO" name="lastname" value={formData.lastname} onChange={handleChange} required className="industrial-input" />
                  </Grid>
                </Grid>
              </div>

              <div className="form-section">
                <Typography className="sub-label-tech"><FiLock /> ACCESS_&_CONTACT</Typography>
                <Grid container>
                  <Grid item xs={12}>
                    <TextField fullWidth margin="normal" label="EMAIL" name="email" value={formData.email} onChange={handleChange} type="email" required className="industrial-input" />
                    <TextField fullWidth margin="normal" label="USUARIO" name="username" value={formData.username} onChange={handleChange} required className="industrial-input" />
                    <TextField fullWidth margin="normal" label="CONTRASEÑA" name="password" value={formData.password} onChange={handleChange} type="password" required={!staffToEdit} className="industrial-input" />
                    <TextField fullWidth margin="normal" label="CELULAR" name="cel" value={formData.cel} onChange={handleChange} className="industrial-input" />
                    <TextField select fullWidth margin="normal" label="ROL" name="rol" value={formData.rol} onChange={handleChange} className="industrial-input">
                      <MenuItem value="administrador">ADMINISTRADOR</MenuItem>
                      <MenuItem value="vendedor">VENDEDOR</MenuItem>
                      <MenuItem value="control">CONTROL_ACCESO</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </div>

              <div className="actions-footer">
                <Button className="btn-mango-minimal" onClick={onClose} fullWidth style={{ color: '#888' }}>CANCELAR</Button>
                <Button type="submit" className="btn-mango-minimal vip-btn" fullWidth>
                  {staffToEdit ? 'GUARDAR' : 'CREAR ACCESO'}
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