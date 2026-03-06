import React, { useState } from 'react';
import { 
  Modal, Box, Typography, Button, IconButton, TextField, 
  Backdrop, Fade, CircularProgress, Checkbox, FormControlLabel 
} from '@mui/material';
import { FiX, FiMinus, FiPlus, FiCreditCard, FiShield } from 'react-icons/fi';
import '../../styles/PurchaseModal.css';

const PurchaseModal = ({ open, onClose, eventName, category, loteName }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isHuman, setIsHuman] = useState(false);
  const [errors, setErrors] = useState({});
  const [userData, setUserData] = useState({ fullName: '', email: '' });

  const validate = () => {
    let tempErrors = {};
    if (!userData.fullName.trim()) tempErrors.fullName = "REQUERIDO";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) tempErrors.email = "EMAIL_INVÁLIDO";
    if (!isHuman) tempErrors.human = true;
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value.toUpperCase() });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleCheckout = async () => {
    if (!validate()) return;
    setLoading(true);
    
    // Simulación de integración con Mercado Pago
    setTimeout(() => {
      console.log("TX_DATA:", { ...userData, quantity, catId: category._id });
      setLoading(false);
    }, 2000);
  };

  if (!category) return null;

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500, sx: { backdropFilter: 'blur(8px)' } } }}>
      <Fade in={open}>
        <Box className="purchase-modal-compact">
          <IconButton className="close-buy-btn" onClick={onClose}><FiX size={18} /></IconButton>

          <Box className="purchase-container-inner">
            <header className="compact-header">
              <Typography className="sub-label-tech">TX_GATEWAY_v1.0</Typography>
              <Typography className="compact-event-title">{eventName}</Typography>
              <Typography className="compact-lote-info">{loteName} // {category.name}</Typography>
            </header>

            <div className="compact-form-grid">
              <TextField 
                fullWidth name="fullName" label="NOMBRE COMPLETO" variant="filled" 
                error={!!errors.fullName} helperText={errors.fullName}
                value={userData.fullName} onChange={handleInputChange} className="tech-input-small"
              />
              
              <TextField 
                fullWidth name="email" label="EMAIL_ADDRESS" variant="filled" 
                error={!!errors.email} helperText={errors.email}
                value={userData.email} onChange={handleInputChange} className="tech-input-small"
              />

              <Box className="compact-quantity-selector">
                <Typography className="q-label-mini">QUANTITY (MAX 5)</Typography>
                <Box className="q-controls">
                  <IconButton onClick={() => setQuantity(Math.max(1, quantity - 1))} size="small" className="q-ctrl-btn"><FiMinus/></IconButton>
                  <Typography className="q-val">{quantity}</Typography>
                  <IconButton onClick={() => setQuantity(Math.min(5, quantity + 1))} size="small" className="q-ctrl-btn"><FiPlus/></IconButton>
                </Box>
              </Box>
            </div>

            <Box className={`compact-catchup ${errors.human ? 'error-blink' : ''}`}>
              <FormControlLabel
                control={<Checkbox size="small" checked={isHuman} onChange={(e) => {setIsHuman(e.target.checked); setErrors({...errors, human: false})}} sx={{ color: '#FF6B00', '&.Mui-checked': { color: '#FF6B00' } }} />}
                label={<Typography sx={{ fontSize: '9px', color: '#888', fontFamily: 'JetBrains Mono' }}>VERIFY_HUMAN_STATUS</Typography>}
              />
            </Box>

            <footer className="compact-footer">
              <div className="total-box-compact">
                <span className="total-label">TOTAL_DUE</span>
                <span className="total-price">${(category.price * quantity).toLocaleString()}</span>
              </div>
              
              <Button 
                fullWidth className="btn-buy-execute" 
                onClick={handleCheckout} disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={22} sx={{ color: '#000' }} />
                ) : (
                  <> <FiCreditCard style={{ marginRight: '8px' }} /> COMPRAR </>
                )}
              </Button>
              
              <div className="secure-badge-mini">
                <FiShield size={10} /> SECURE_ENCRYPTION_ACTIVE
              </div>
            </footer>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default PurchaseModal;