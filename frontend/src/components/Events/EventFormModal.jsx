import React, { useState, useEffect, useRef } from 'react';
import { 
  Modal, Box, Typography, TextField, Button, IconButton, 
  Fade, Backdrop, Grid, CircularProgress 
} from '@mui/material';
import { 
  FiX, FiPlus, FiTrash2, FiMusic, FiMapPin, 
  FiLayers, FiUploadCloud, FiImage, FiTerminal, FiAlertCircle, FiHelpCircle 
} from 'react-icons/fi';
import { useEvents } from '../../hooks/Events/useEvents';
import '../../styles/EventManagement.css';

const EventFormModal = ({ open, onClose, onSave, eventToEdit }) => {
  const { createEvent, updateEvent, loading, error: apiError } = useEvents();
  const fileInputRef = useRef(null);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });
  const [showConfirm, setShowConfirm] = useState(false);

  // Estructuras iniciales con IDs únicos para evitar ediciones masivas
  const initialCategory = () => ({ id: crypto.randomUUID(), name: 'GENERAL', price: 0, stock: 0, maxStockPerSeller: 0 });
  const initialLote = () => ({
    id: crypto.randomUUID(),
    loteName: '',
    categories: [initialCategory()]
  });

  const [formData, setFormData] = useState({
    name: '', location: '', address: '', date: '', djs: [''], ageLimit: '18',
    flyer: '', lotes: [initialLote()]
  });

  useEffect(() => {
    if (open) {
      setStatusMsg({ text: '', type: '' });
      if (eventToEdit) {
        const formattedDate = eventToEdit.date ? new Date(eventToEdit.date).toISOString().slice(0, 16) : '';
        // Mapeamos los datos que vienen del server asegurando que tengan IDs para la UI
        setFormData({
          ...eventToEdit,
          date: formattedDate,
          lotes: eventToEdit.lotes?.map(l => ({
            ...l,
            id: l._id || crypto.randomUUID(),
            categories: l.categories?.map(c => ({ ...c, id: c._id || crypto.randomUUID() }))
          })) || [initialLote()]
        });
      } else {
        setFormData({
          name: '', location: '', address: '', date: '', djs: [''], ageLimit: '18',
          flyer: '', lotes: [initialLote()]
        });
      }
    }
  }, [open, eventToEdit]);

  // --- CORRECCIÓN DE HANDLERS (EDICIÓN INDIVIDUAL) ---

  const handleDjChange = (index, value) => {
    const newDjs = [...formData.djs];
    newDjs[index] = value;
    setFormData(prev => ({ ...prev, djs: newDjs }));
  };

  const updateLoteName = (loteId, val) => {
    setFormData(prev => ({
      ...prev,
      lotes: prev.lotes.map(l => l.id === loteId ? { ...l, loteName: val.toUpperCase() } : l)
    }));
  };

  const updateCategory = (loteId, catId, field, val) => {
    setFormData(prev => ({
      ...prev,
      lotes: prev.lotes.map(lote => {
        if (lote.id !== loteId) return lote;
        return {
          ...lote,
          categories: lote.categories.map(cat => 
            cat.id === catId ? { ...cat, [field]: val } : cat
          )
        };
      })
    }));
  };

  // --- RESTO DE FUNCIONES ---
  const addDj = () => setFormData(prev => ({ ...prev, djs: [...prev.djs, ''] }));
  const removeDj = (i) => setFormData(prev => ({ ...prev, djs: prev.djs.filter((_, idx) => idx !== i) }));
  const addLote = () => setFormData(prev => ({ ...prev, lotes: [...prev.lotes, initialLote()] }));
  const addCategoryToLote = (loteId) => {
    setFormData(prev => ({
      ...prev,
      lotes: prev.lotes.map(l => l.id === loteId ? { ...l, categories: [...l.categories, initialCategory()] } : l)
    }));
  };
  const removeCategoryFromLote = (loteId, catId) => {
    setFormData(prev => ({
      ...prev,
      lotes: prev.lotes.map(l => l.id === loteId ? { ...l, categories: l.categories.filter(c => c.id !== catId) } : l)
    }));
  };

  const executeDeployment = async () => {
    setShowConfirm(false);
    setStatusMsg({ text: 'INITIALIZING_CORE_DEPLOYMENT...', type: 'info' });
    
    // Limpieza de IDs temporales antes de enviar al backend
    const cleanLotes = formData.lotes.map(({ id, ...lote }) => ({
      ...lote,
      loteName: lote.loteName || "LOTE_DEFAULT",
      categories: lote.categories.map(({ id, ...cat }) => ({
        ...cat,
        price: Number(cat.price),
        stock: Number(cat.stock),
        maxStockPerSeller: Number(cat.maxStockPerSeller)
      }))
    }));

    const payload = { 
      ...formData, 
      date: new Date(formData.date).toISOString(), 
      lotes: cleanLotes, 
      djs: formData.djs.filter(dj => dj.trim() !== '') 
    };

    try {
      if (eventToEdit) await updateEvent(eventToEdit._id, payload);
      else await createEvent(payload);
      setStatusMsg({ text: 'DATABASE_SYNCHRONIZED_SUCCESSFULLY', type: 'success' });
      setTimeout(() => { onSave(); onClose(); }, 1500);
    } catch (err) {
      setStatusMsg({ text: `[FATAL_ERROR]: ${apiError || 'DATA_FAILURE'}`, type: 'error' });
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose} closeAfterTransition slots={{ backdrop: Backdrop }}>
        <Fade in={open}>
          <Box className="modal-industrial-full-wrapper">
            <IconButton onClick={onClose} className="modal-close-btn"><FiX size={32}/></IconButton>

            <form onSubmit={(e) => { e.preventDefault(); setShowConfirm(true); }} className="event-form-layout">
              <header className="modal-header-section">
                <Typography className="sub-label-tech" color="primary">● SYSTEM_INFRASTRUCTURE_v7.2</Typography>
                <Typography variant="h3" className="syncopate-title">
                  {eventToEdit ? 'OVERWRITE_DATA' : 'NEW_ENROLLMENT'}
                </Typography>
              </header>

              <Box className="form-scroll-container">
                <Grid container spacing={4} sx={{ m: 0, mb: 5 }}>
                   {/* SECCIÓN INFO (Nombre, Loc, Fecha) */}
                  <Grid item xs={12} md={4}>
                    <Box className="column-content">
                      <Typography className="sub-label-tech"><FiMapPin /> GEO_LOCATION</Typography>
                      <TextField fullWidth label="EVENT_NAME" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="industrial-input" sx={{mb:2}} />
                      <TextField fullWidth label="LOCATION" value={formData.location} onChange={(e)=>setFormData({...formData, location: e.target.value})} className="industrial-input" sx={{mb:2}} />
                      <TextField fullWidth label="DATE_TIME" type="datetime-local" value={formData.date} onChange={(e)=>setFormData({...formData, date: e.target.value})} className="industrial-input" InputLabelProps={{ shrink: true }} />
                    </Box>
                  </Grid>

                  {/* SECCIÓN ARTISTAS */}
                  <Grid item xs={12} md={4}>
                    <Box className="column-content side-borders">
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

                  {/* SECCIÓN FLYER */}
                  <Grid item xs={12} md={4}>
                    <Typography className="sub-label-tech"><FiImage /> MEDIA_ASSETS</Typography>
                    <Box 
                      className="flyer-upload-zone-panoramic" 
                      onClick={() => fileInputRef.current.click()}
                      style={{ backgroundImage: formData.flyer ? `url(${formData.flyer})` : 'none' }}
                    >
                      {!formData.flyer && <FiUploadCloud size={40} />}
                      <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => {
                         const file = e.target.files[0];
                         if (file) {
                           const reader = new FileReader();
                           reader.onloadend = () => setFormData({ ...formData, flyer: reader.result });
                           reader.readAsDataURL(file);
                         }
                      }} />
                    </Box>
                  </Grid>
                </Grid>

                {/* SECCIÓN TICKETING */}
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
                            <TextField variant="standard" value={lote.loteName} onChange={(e) => updateLoteName(lote.id, e.target.value)} placeholder="BATCH_NAME" sx={{ input: { color: '#FF6B00', fontFamily: 'JetBrains Mono', fontWeight: '900' } }} />
                            <IconButton color="error" onClick={() => setFormData(prev => ({...prev, lotes: prev.lotes.filter(l => l.id !== lote.id)}))}>
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

              <footer className="form-footer-staff">
                {statusMsg.text && (
                  <Box className={`terminal-status-bar ${statusMsg.type}`}>
                    {statusMsg.type === 'error' ? <FiAlertCircle className="blink" /> : <FiTerminal />}
                    <Typography variant="caption">{`> ${statusMsg.text}`}</Typography>
                  </Box>
                )}
                <Box className="footer-actions">
                  <Button onClick={onClose} className="btn-abort">ABORT_MISSION</Button>
                  <Button type="submit" className="btn-mango-minimal vip-btn" disabled={loading} sx={{ minWidth: '220px' }}>
                    {loading ? <CircularProgress size={20} sx={{ color: '#000' }} /> : 'INITIALIZE_DEPLOY'}
                  </Button>
                </Box>
              </footer>
            </form>
          </Box>
        </Fade>
      </Modal>

      {/* MODAL DE CONFIRMACIÓN */}
      <Modal open={showConfirm} onClose={() => setShowConfirm(false)} slots={{ backdrop: Backdrop }} slotProps={{ backdrop: { sx: { backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' } } }}>
        <Fade in={showConfirm}>
          <Box className="industrial-confirm-modal">
            <FiHelpCircle size={48} color="#FF6B00" style={{ marginBottom: '15px' }} />
            <Typography sx={{ color: '#888', mb: 4, fontFamily: 'JetBrains Mono', textAlign: 'center', fontSize: '12px' }}>
              ¿Seguro que quieres crear este evento para la venta? <br/>
              <span style={{ color: '#FF6B00' }}>Esta acción sincronizará la base de datos pública.</span>
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
              <Button fullWidth onClick={() => setShowConfirm(false)} sx={{ border: '1px solid #444', color: '#fff', borderRadius: 0, fontFamily: 'JetBrains Mono' }}>CANCELAR</Button>
              <Button fullWidth onClick={executeDeployment} variant="contained" sx={{ bgcolor: '#FF6B00', color: '#000', borderRadius: 0, '&:hover': { bgcolor: '#e66000' }, fontWeight: '900', fontFamily: 'JetBrains Mono' }}>SI, DESPLEGAR</Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default EventFormModal;