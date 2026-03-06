import React, { useState, useEffect } from 'react';
import { 
  Modal, Box, Typography, Button, IconButton, TextField, 
  Backdrop, Fade, CircularProgress, Checkbox, FormControlLabel,
  Divider // <--- IMPORTACIÓN CORREGIDA AQUÍ
} from '@mui/material';
import { 
  FiX, FiMinus, FiPlus, FiCreditCard, FiShield, 
  FiCheckCircle, FiSend, FiZap 
} from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react'; 
import '../../styles/PurchaseModal.css';

const PurchaseModal = ({ open, onClose, eventName, category, loteName }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [purchased, setPurchased] = useState(false); 
  const [isHuman, setIsHuman] = useState(false);
  const [errors, setErrors] = useState({});
  const [userData, setUserData] = useState({ fullName: '', email: '' });

  // Reset al cerrar
  useEffect(() => {
    if (!open) {
      setLoading(false);
      setPurchased(false);
      setQuantity(1);
      setIsHuman(false);
      setErrors({});
      setUserData({ fullName: '', email: '' });
    }
  }, [open]);

  const handleCheckout = async () => {
    if (!userData.fullName.trim() || !userData.email.trim() || !isHuman) {
      setErrors({ human: !isHuman });
      return;
    }
    setLoading(true);
    
    // Simulación de procesamiento y envío de correo
    setTimeout(() => {
      setLoading(false);
      setPurchased(true);
    }, 2500);
  };

  if (!category) return null;

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500, sx: { backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0,0,0,0.9)' } } }}>
      <Fade in={open}>
        <Box className="purchase-modal-compact">
          <IconButton className="close-buy-btn" onClick={onClose} sx={{ color: '#fff' }}><FiX size={20} /></IconButton>

          <Box className="purchase-container-inner">
            {!purchased ? (
              <>
                <header className="compact-header">
                  <Typography className="sub-label-tech">TX_GATEWAY_v1.0</Typography>
                  <Typography className="compact-event-title">{eventName}</Typography>
                  <Typography className="compact-lote-info">{loteName} // {category.name}</Typography>
                </header>

                <div className="compact-form-grid">
                  <TextField 
                    fullWidth name="fullName" label="NOMBRE COMPLETO" variant="filled" 
                    value={userData.fullName} onChange={(e) => setUserData({...userData, fullName: e.target.value.toUpperCase()})} 
                    className="tech-input-small"
                  />
                  <TextField 
                    fullWidth name="email" label="EMAIL_ADDRESS" variant="filled" 
                    value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value.toUpperCase()})} 
                    className="tech-input-small"
                  />
                  <Box className="compact-quantity-selector">
                    <Typography className="q-label-mini">QUANTITY</Typography>
                    <Box className="q-controls">
                      <IconButton onClick={() => setQuantity(Math.max(1, quantity - 1))} size="small" className="q-ctrl-btn"><FiMinus/></IconButton>
                      <Typography className="q-val">{quantity}</Typography>
                      <IconButton onClick={() => setQuantity(Math.min(5, quantity + 1))} size="small" className="q-ctrl-btn"><FiPlus/></IconButton>
                    </Box>
                  </Box>
                </div>

                <Box className={`compact-catchup ${errors.human ? 'error-blink' : ''}`}>
                  <FormControlLabel
                    control={<Checkbox size="small" checked={isHuman} onChange={(e) => setIsHuman(e.target.checked)} sx={{ color: '#FF6B00' }} />}
                    label={<Typography sx={{ fontSize: '9px', color: '#888', fontFamily: 'JetBrains Mono' }}>VERIFY_HUMAN_STATUS</Typography>}
                  />
                </Box>

                <footer className="compact-footer">
                  <div className="total-box-compact">
                    <span className="total-label">TOTAL_DUE</span>
                    <span className="total-price">${(category.price * quantity).toLocaleString()}</span>
                  </div>
                  <Button fullWidth className="btn-buy-execute" onClick={handleCheckout} disabled={loading}>
                    {loading ? <CircularProgress size={22} sx={{ color: '#000' }} /> : <><FiCreditCard style={{ marginRight: '8px' }} /> CONFIRMAR PAGO</>}
                  </Button>
                </footer>
              </>
            ) : (
              /* VISTA DE ÉXITO PERSONALIZADA "MANGUERO" */
              <Box className="success-view-manguero">
                <div className="success-logo-wrapper">
                    <FiZap size={40} color="#FF6B00" className="zap-icon" />
                </div>
                
                <Typography className="manguero-title">¡GRACIAS POR TU COMPRA, MANGUERO!</Typography>
                
                <Box className="qr-visual-frame">
                  <QRCodeSVG 
                    value={`MANGUERO_ID:${userData.fullName}|REF:${Math.random().toString(36).toUpperCase().substring(2,10)}`} 
                    size={140}
                    bgColor={"#080808"}
                    fgColor={"#FF6B00"}
                    level={"M"}
                  />
                </Box>

                <Box className="success-notification-box">
                    <FiSend size={18} color="#00ff41" />
                    <Typography className="notification-text">
                        SISTEMA: REVISA TU CORREO. <br/>
                        <span>LAS ENTRADAS HAN SIDO ENVIADAS A: {userData.email}</span>
                    </Typography>
                </Box>

                <Divider sx={{ bgcolor: '#1a1a1a', my: 2.5, width: '100%' }} />
                
                <Button fullWidth className="btn-buy-execute btn-success-finish" onClick={onClose}>
                  VOLVER AL INICIO
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default PurchaseModal;