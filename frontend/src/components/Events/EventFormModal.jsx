import React, { useState, useEffect, useRef } from 'react';
import { 
  Modal, Box, Typography, TextField, Button, IconButton, 
  Fade, Backdrop, Grid, CircularProgress 
} from '@mui/material';
import { 
  FiX, FiPlus, FiTrash2, FiMusic, FiMapPin, 
  FiLayers, FiUploadCloud, FiImage, FiTerminal, FiAlertCircle 
} from 'react-icons/fi';
import { useEvents } from '../../hooks/Events/useEvents';
import '../../styles/EventManagement.css';

const EventFormModal = ({ open, onClose, onSave, eventToEdit }) => {
  const { createEvent, updateEvent, loading, error: apiError } = useEvents();
  const fileInputRef = useRef(null);
  
  // Estados de control industrial
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });
  const [isConfirming, setIsConfirming] = useState(false);

  const initialLote = () => ({
    id: Date.now(),
    loteName: '',
    categories: [{ id: Date.now() + 1, name: 'GENERAL', price: 0, stock: 0, maxStockPerSeller: 0 }]
  });

  const [formData, setFormData] = useState({
    name: '', location: '', address: '', date: '', djs: [''], ageLimit: '18',
    flyer: '', lotes: [initialLote()]
  });

  useEffect(() => {
    if (open) {
      setStatusMsg({ text: '', type: '' });
      setIsConfirming(false);
      if (eventToEdit) {
        // Formatear fecha para el input datetime-local (YYYY-MM-DDTHH:mm)
        const formattedDate = eventToEdit.date ? new Date(eventToEdit.date).toISOString().slice(0, 16) : '';
        setFormData({ ...eventToEdit, date: formattedDate });
      } else {
        setFormData({
          name: '', location: '', address: '', date: '', djs: [''], ageLimit: '18',
          flyer: '', lotes: [initialLote()]
        });
      }
    }
  }, [open, eventToEdit]);

  // --- HANDLERS ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, flyer: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const addDj = () => setFormData({ ...formData, djs: [...formData.djs, ''] });
  const handleDjChange = (i, v) => {
    const n = [...formData.djs]; n[i] = v; setFormData({ ...formData, djs: n });
  };
  const removeDj = (i) => setFormData({ ...formData, djs: formData.djs.filter((_, idx) => idx !== i) });

  const addLote = () => setFormData({ ...formData, lotes: [...formData.lotes, initialLote()] });
  const updateLoteName = (id, val) => setFormData({
    ...formData, lotes: formData.lotes.map(l => l.id === id ? { ...l, loteName: val.toUpperCase() } : l)
  });

  const updateCategory = (lId, cId, field, val) => setFormData({
    ...formData, lotes: formData.lotes.map(l => l.id === lId ? {
      ...l, categories: l.categories.map(c => c.id === cId ? { ...c, [field]: val } : c)
    } : l)
  });

  const addCategoryToLote = (loteId) => {
    const newCat = { id: Date.now(), name: '', price: 0, stock: 0, maxStockPerSeller: 0 };
    setFormData({
      ...formData,
      lotes: formData.lotes.map(l => l.id === loteId ? { ...l, categories: [...l.categories, newCat] } : l)
    });
  };

  const removeCategoryFromLote = (loteId, catId) => {
    setFormData({
      ...formData,
      lotes: formData.lotes.map(l => l.id === loteId ? { ...l, categories: l.categories.filter(c => c.id !== catId) } : l)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Paso 1: Confirmación
    if (!isConfirming) {
      setIsConfirming(true);
      setStatusMsg({ text: 'AWAITING_MANUAL_CONFIRMATION...', type: 'info' });
      return;
    }

    // Paso 2: Envío
    setStatusMsg({ text: 'SYNCHRONIZING_INFRASTRUCTURE...', type: 'info' });

    const cleanLotes = formData.lotes.map(lote => ({
      loteName: lote.loteName || "LOTE_DEFAULT",
      categories: lote.categories.map(cat => ({
        name: cat.name || "GENERAL",
        price: Number(cat.price),
        stock: Number(cat.stock),
        maxStockPerSeller: Number(cat.maxStockPerSeller)
      }))
    }));

    const payload = { 
      ...formData, 
      date: new Date(formData.date).toISOString(), // Fix de persistencia de fecha
      lotes: cleanLotes, 
      djs: formData.djs.filter(dj => dj.trim() !== '') 
    };

    try {
      if (eventToEdit) await updateEvent(eventToEdit._id, payload);
      else await createEvent(payload);
      
      setStatusMsg({ text: 'DATABASE_SYNCHRONIZED_SUCCESSFULLY', type: 'success' });
      setTimeout(() => { onSave(); onClose(); }, 1500);
    } catch (err) {
      setIsConfirming(false);
      setStatusMsg({ text: `[FATAL_ERROR]: ${apiError || 'INFRASTRUCTURE_FAILURE'}`, type: 'error' });
    }
  };

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition slots={{ backdrop: Backdrop }}>
      <Fade in={open}>
        <Box className="modal-industrial-full-wrapper">
          <IconButton onClick={onClose} className="modal-close-btn"><FiX size={32}/></IconButton>

          <form onSubmit={handleSubmit} className="event-form-layout">
            <header className="modal-header-section">
              <Typography className="sub-label-tech" color="primary">● SYSTEM_INFRASTRUCTURE_v7.2</Typography>
              <Typography variant="h3" className="syncopate-title" sx={{ fontSize: {xs: '1.5rem', md: '2.5rem'} }}>
                {eventToEdit ? 'OVERWRITE_DATA' : 'NEW_ENROLLMENT'}
              </Typography>
            </header>

            <Box className="form-scroll-container">
              <Grid container spacing={4} sx={{ width: '100%', m: 0, mb: 5 }}>
                {/* MEDIA */}
                <Grid item xs={12} md={4} sx={{ pl: '0 !important' }}>
                  <Typography className="sub-label-tech"><FiImage /> MEDIA_ASSETS</Typography>
                  <Box 
                    className="flyer-upload-zone-panoramic" 
                    onClick={() => fileInputRef.current.click()}
                    style={{ backgroundImage: formData.flyer ? `url(${formData.flyer})` : 'none' }}
                  >
                    {!formData.flyer && <FiUploadCloud size={40} />}
                    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
                  </Box>
                </Grid>

                {/* INFO */}
                <Grid item xs={12} md={4}>
                  <Box className="column-content side-borders">
                    <Typography className="sub-label-tech"><FiMapPin /> GEO_LOCATION</Typography>
                    <TextField fullWidth label="EVENT_NAME" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="industrial-input" sx={{mb:2}} />
                    <TextField fullWidth label="LOCATION" value={formData.location} onChange={(e)=>setFormData({...formData, location: e.target.value})} className="industrial-input" sx={{mb:2}} />
                    <TextField fullWidth label="DATE_TIME" type="datetime-local" value={formData.date} onChange={(e)=>setFormData({...formData, date: e.target.value})} className="industrial-input" InputLabelProps={{ shrink: true }} />
                  </Box>
                </Grid>

                {/* LINEUP */}
                <Grid item xs={12} md={4}>
                  <Box className="column-content">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography className="sub-label-tech"><FiMusic /> LINE_UP</Typography>
                      <Button onClick={addDj} className="btn-add-tech" size="small">+ ARTIST</Button>
                    </Box>
                    <Box className="artist-scroll-area">
                      {formData.djs.map((dj, i) => (
                        <div key={`dj-${i}`} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                          <TextField fullWidth placeholder="NAME" value={dj} onChange={(e) => handleDjChange(i, e.target.value)} className="industrial-input" size="small" />
                          <IconButton size="small" onClick={()=>removeDj(i)} sx={{color:'#444'}}><FiTrash2/></IconButton>
                        </div>
                      ))}
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {/* TICKETING */}
              <Box className="ticketing-section-wrapper">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography className="sub-label-tech"><FiLayers /> TICKETING_INFRASTRUCTURE</Typography>
                  <Button onClick={addLote} className="btn-add-tech">+ INITIALIZE_BATCH</Button>
                </Box>

                <Grid container spacing={3}>
                  {formData.lotes.map((lote) => (
                    <Grid item xs={12} lg={6} key={lote.id}>
                      <Box className="lote-container-panoramic">
                        <Box className="lote-header" sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <TextField 
                            variant="standard" value={lote.loteName} 
                            onChange={(e) => updateLoteName(lote.id, e.target.value)}
                            placeholder="BATCH_NAME"
                            sx={{ input: { color: '#FF6B00', fontFamily: 'JetBrains Mono', fontWeight: '900' } }}
                          />
                          <IconButton color="error" onClick={() => setFormData({...formData, lotes: formData.lotes.filter(l => l.id !== lote.id)})}>
                            <FiTrash2 size={20}/>
                          </IconButton>
                        </Box>

                        {lote.categories.map((cat) => (
                          <Box key={cat.id} sx={{ mb: 1, p: 1, borderBottom: '1px solid #111' }}>
                            <Grid container spacing={1} alignItems="center">
                              <Grid item xs={4}><TextField fullWidth label="TYPE" size="small" value={cat.name} onChange={(e)=>updateCategory(lote.id, cat.id, 'name', e.target.value.toUpperCase())} className="industrial-input" /></Grid>
                              <Grid item xs={2}><TextField fullWidth label="$" size="small" type="number" value={cat.price} onChange={(e)=>updateCategory(lote.id, cat.id, 'price', e.target.value)} className="industrial-input" /></Grid>
                              <Grid item xs={2}><TextField fullWidth label="STK" size="small" type="number" value={cat.stock} onChange={(e)=>updateCategory(lote.id, cat.id, 'stock', e.target.value)} className="industrial-input" /></Grid>
                              <Grid item xs={3}><TextField fullWidth label="MAX" size="small" type="number" value={cat.maxStockPerSeller} onChange={(e)=>updateCategory(lote.id, cat.id, 'maxStockPerSeller', e.target.value)} className="industrial-input" /></Grid>
                              <Grid item xs={1}><IconButton size="small" sx={{color:'#ff3131'}} onClick={() => removeCategoryFromLote(lote.id, cat.id)}><FiTrash2/></IconButton></Grid>
                            </Grid>
                          </Box>
                        ))}
                        <Button startIcon={<FiPlus />} fullWidth onClick={() => addCategoryToLote(lote.id)} sx={{ color: '#FF6B00', mt: 1, fontFamily: 'JetBrains Mono', fontSize: '10px' }}>ADD_CATEGORY_UNIT</Button>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>

            {/* CONSOLA DE ESTADO Y FOOTER */}
            <footer className="form-footer-staff">
              {statusMsg.text && (
                <Box className={`terminal-status-bar ${statusMsg.type}`}>
                  {statusMsg.type === 'error' ? <FiAlertCircle className="blink" /> : <FiTerminal />}
                  <Typography variant="caption">{`> ${statusMsg.text}`}</Typography>
                </Box>
              )}
              
              <Box className="footer-actions">
                <Button 
                  onClick={() => isConfirming ? setIsConfirming(false) : onClose()} 
                  className="btn-abort" 
                  disabled={loading}
                >
                  {isConfirming ? 'BACK' : 'ABORT_MISSION'}
                </Button>

                <Button 
                  type="submit" 
                  className={`btn-mango-minimal vip-btn ${isConfirming ? 'confirm-mode' : ''}`} 
                  disabled={loading}
                  sx={{ minWidth: '240px' }}
                >
                  {loading ? (
                    <CircularProgress size={20} sx={{ color: '#000' }} />
                  ) : (
                    isConfirming ? 'CONFIRM_DATA_ENROLLMENT?' : (eventToEdit ? 'OVERWRITE_CHANGES' : 'DEPLOY_ENROLLMENT')
                  )}
                </Button>
              </Box>
            </footer>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
};

export default EventFormModal;