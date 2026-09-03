import React, { useState, useEffect } from 'react';
import { 
  Modal, Box, Typography, IconButton, TextField, 
  Backdrop, Fade, Button, CircularProgress, Checkbox, FormControlLabel 
} from '@mui/material';
import { 
  FiX, FiMinus, FiPlus, FiCreditCard, FiSend, FiCheckCircle 
} from 'react-icons/fi';
import { usePurchase } from '../../hooks/Ticket/usePurchase'; 
import '../../styles/PurchaseModal.css';

const PurchaseModal = ({ open, onClose, eventName, category, loteName }) => {
  const [quantity, setQuantity] = useState(1);
  const [userData, setUserData] = useState({ fullName: '', email: '' });
  const [isHuman, setIsHuman] = useState(false);
  const [formError, setFormError] = useState(false);

  const { executePurchase, loading, success, resetStatus } = usePurchase();

  useEffect(() => {
    if (!open) {
      resetStatus();
      setQuantity(1);
      setIsHuman(false);
      setFormError(false);
      setUserData({ fullName: '', email: '' });
    }
  }, [open, resetStatus]);

  const handleCheckout = async () => {
    if (!userData.fullName.trim() || !userData.email.trim() || !isHuman) {
      setFormError(true);
      return;
    }

    await executePurchase({
      fullName: userData.fullName,
      email: userData.email,
      eventName: eventName,
      categoryName: category?.name,
      price: category?.price,
      quantity: quantity,
      total: category?.price * quantity
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value.toUpperCase() });
    if (formError) setFormError(false);
  };

  if (!category) return null;

  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      closeAfterTransition 
      slots={{ backdrop: Backdrop }}
      slotProps={{ 
        backdrop: { 
          timeout: 500, 
          sx: { backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0,0,0,0.9)' } 
        } 
      }}
    >
      <Fade in={open}>
        <Box className="purchase-modal-compact">
          {/* ÚNICO MÉTODO DE CIERRE: LA CRUZ */}
          <IconButton className="close-buy-btn" onClick={onClose} sx={{ zIndex: 10 }}>
            <FiX size={24} color="#fff" />
          </IconButton>

          <Box className="purchase-container-inner">
            {!success ? (
              /* VISTA A: FORMULARIO */
              <>
                <header className="compact-header">
                  <Typography className="sub-label-tech">TX_GATEWAY_v1.0</Typography>
                  <Typography className="compact-event-title">{eventName}</Typography>
                  <Typography className="compact-lote-info">{loteName} // {category.name}</Typography>
                </header>

                <div className="compact-form-grid">
                  <TextField 
                    fullWidth name="fullName" label="NOMBRE COMPLETO" variant="filled" 
                    value={userData.fullName} onChange={handleInputChange} 
                    className="tech-input-small"
                  />
                  <TextField 
                    fullWidth name="email" label="EMAIL_ADDRESS" variant="filled" 
                    value={userData.email} onChange={handleInputChange} 
                    className="tech-input-small"
                  />
                  
                  <Box className="compact-quantity-selector">
                    <Typography className="q-label-mini">CANTIDAD (MAX 5)</Typography>
                    <Box className="q-controls">
                      <IconButton onClick={() => setQuantity(Math.max(1, quantity - 1))} size="small" className="q-ctrl-btn"><FiMinus/></IconButton>
                      <Typography className="q-val">{quantity}</Typography>
                      <IconButton onClick={() => setQuantity(Math.min(5, quantity + 1))} size="small" className="q-ctrl-btn"><FiPlus/></IconButton>
                    </Box>
                  </Box>
                </div>

                <Box className={`compact-catchup ${formError && !isHuman ? 'error-blink' : ''}`}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        size="small" 
                        checked={isHuman} 
                        onChange={(e) => setIsHuman(e.target.checked)} 
                        sx={{ color: '#FF6B00', '&.Mui-checked': { color: '#FF6B00' } }} 
                      />
                    }
                    label={<Typography sx={{ fontSize: '9px', color: '#888', fontFamily: 'JetBrains Mono' }}>VERIFY_HUMAN_STATUS</Typography>}
                  />
                </Box>

                <footer className="compact-footer">
                  <div className="total-box-compact">
                    <span className="total-label">TOTAL_DUE</span>
                    <span className="total-price">${(category.price * quantity).toLocaleString()}</span>
                  </div>
                  
                  <Button 
                    fullWidth 
                    className="btn-buy-execute" 
                    onClick={handleCheckout} 
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={22} sx={{ color: '#000' }} /> : <> <FiCreditCard style={{ marginRight: '8px' }} /> CONFIRMAR PAGO </>}
                  </Button>
                </footer>
              </>
            ) : (
              /* VISTA B: ÉXITO (SIN QR) */
              <Box className="success-view-manguero">
                {/* ICONO DE ÉXITO ESTILO TECH */}
                <div className="success-icon-container">
                    <FiCheckCircle size={80} color="#00FF41" className="check-success-anim" />
                </div>
                
                <Typography className="manguero-title-success">PAGO_APROBADO</Typography>

                <Box className="success-card-summary">
                  <Typography className="success-category-name">
                    {category.name.toUpperCase()}
                  </Typography>
                  <Typography className="success-user-text">
                    PARA: {userData.fullName}
                  </Typography>
                  
                  <div className="success-divider" />

                  <Typography className="success-instruction">
                    Tus tickets digitales han sido generados y enviados.
                  </Typography>
                </Box>

                <Box className="success-notification-box-final">
                    <FiSend size={20} color="#FF6B00" />
                    <Box>
                        <Typography className="notification-label">REVISA TU BANDEJA:</Typography>
                        <Typography className="notification-email-text">{userData.email}</Typography>
                    </Box>
                </Box>

                <Typography sx={{ color: '#444', fontSize: '10px', mt: 4, fontFamily: 'monospace' }}>
                    SISTEMA AUTOMATIZADO MANGUERO_TECH // 2026
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default PurchaseModal;