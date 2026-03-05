import React, { useState, useEffect, useRef } from 'react';
import { 
  Modal, Box, Typography, TextField, Button, IconButton, 
  Fade, Backdrop, Grid, CircularProgress, Switch, FormControlLabel 
} from '@mui/material';
import { 
  FiX, FiPlus, FiTrash2, FiMusic, FiMapPin, 
  FiLayers, FiUploadCloud, FiImage, FiTerminal, FiAlertCircle, FiClock 
} from 'react-icons/fi';
import { useEvents } from '../../hooks/Events/useEvents';
import '../../styles/EventManagement.css';

const EventFormModal = ({ open, onClose, onSave, eventToEdit }) => {
  const { createEvent, updateEvent, loading, error: apiError } = useEvents();
  const fileInputRef = useRef(null);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });
  const [showConfirm, setShowConfirm] = useState(false);

  // --- ESTRUCTURAS INICIALES ---
  const initialCategory = () => ({ 
    id: crypto.randomUUID(), 
    name: 'GENERAL', price: 0, stock: 0, maxStockPerSeller: 0 
  });

  const initialLote = () => ({
    id: crypto.randomUUID(),
    loteName: '',
    isActive: true,
    expirationDays: 0,
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
        setFormData({
          ...eventToEdit,
          date: formattedDate,
          lotes: eventToEdit.lotes?.map(l => ({
            ...l,
            id: l._id || crypto.randomUUID(),
            isActive: l.isActive ?? true,
            expirationDays: l.expirationDays ?? 0,
            categories: l.categories?.map(c => ({ ...c, id: c._id || crypto.randomUUID() }))
          })) || [initialLote()]
        });
      } else {
        setFormData({ name: '', location: '', address: '', date: '', djs: [''], ageLimit: '18', flyer: '', lotes: [initialLote()] });
      }
    }
  }, [open, eventToEdit]);

  // --- HANDLERS DE ESTADO ---
  const updateCategory = (loteId, catId, field, val) => {
    setFormData(prev => ({
      ...prev,
      lotes: prev.lotes.map(l => l.id === loteId ? {
        ...l, categories: l.categories.map(c => c.id === catId ? { ...c, [field]: val } : c)
      } : l)
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const executeDeployment = async () => {
    setShowConfirm(false);
    setStatusMsg({ text: 'SYNCING_INDUSTRIAL_DATABASE...', type: 'info' });

    const payload = { 
      ...formData, 
      date: new Date(formData.date).toISOString(), 
      lotes: formData.lotes.map(({ id, ...lote }) => ({
        ...lote,
        categories: lote.categories.map(({ id, ...cat }) => ({ ...cat }))
      })),
      djs: formData.djs.filter(dj => dj.trim() !== '') 
    };

    try {
      if (eventToEdit) await updateEvent(eventToEdit._id, payload);
      else await createEvent(payload);
      setStatusMsg({ text: 'DEPLOYMENT_SUCCESSFUL', type: 'success' });
      setTimeout(() => { onSave(); onClose(); }, 1500);
    } catch (err) {
      setStatusMsg({ text: `[FAILURE]: ${apiError || 'DATABASE_REFUSED'}`, type: 'error' });
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose} slots={{ backdrop: Backdrop }}>
        <Fade in={open}>
          <Box className="modal-industrial-full-wrapper">
            <IconButton onClick={onClose} className="modal-close-btn"><FiX size={32}/></IconButton>

            <form onSubmit={handleFormSubmit} className="event-form-layout">
              <header className="modal-header-section">
                <Typography className="sub-label-tech">● UNIT_RECRUITMENT_STATION_v9.0</Typography>
                <Typography variant="h3" className="syncopate-title">{eventToEdit ? 'OVERWRITE_DATA' : 'NEW_ENROLLMENT'}</Typography>
              </header>

              <Box className="form-scroll-container">
                <Grid container spacing={4} sx={{ m: 0, mb: 5 }}>
                  {/* COLUMNA 1: INFO CORE */}
                  <Grid item xs={12} md={4}>
                    <Box className="column-content">
                      <Typography className="sub-label-tech"><FiMapPin /> EVENTO </Typography>
                      <TextField required fullWidth label="NOMBRE" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value.toUpperCase()})} className="industrial-input" sx={{mb:2}} />
                      <TextField required fullWidth label="UBICACION" value={formData.location} onChange={(e)=>setFormData({...formData, location: e.target.value})} className="industrial-input" sx={{mb:2}} />
                      <TextField  fullWidth label="DIRECCION" value={formData.address} onChange={(e)=>setFormData({...formData, address: e.target.value})} className="industrial-input" sx={{mb:2}} />
                      <Grid container spacing={2}>
                        <Grid item xs={6}><TextField required fullWidth label="EDAD LIMITE" type="number" value={formData.ageLimit} onChange={(e)=>setFormData({...formData, ageLimit: e.target.value})} className="industrial-input" /></Grid>
                        <Grid item xs={6}><TextField required fullWidth label="FECHA" type="datetime-local" value={formData.date} onChange={(e)=>setFormData({...formData, date: e.target.value})} className="industrial-input" InputLabelProps={{ shrink: true }} /></Grid>
                      </Grid>
                    </Box>
                  </Grid>

                  {/* COLUMNA 2: LINE UP */}
                  <Grid item xs={12} md={4}>
                    <Box className="column-content side-borders">
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography className="sub-label-tech"><FiMusic /> LINE UP</Typography>
                        <Button onClick={() => setFormData(p => ({...p, djs: [...p.djs, '']}))} className="btn-add-tech">+ ARTIST</Button>
                      </Box>
                      <Box className="artist-scroll-area">
                        {formData.djs.map((dj, i) => (
                          <div key={i} className="artist-input-row">
                            <TextField required fullWidth placeholder="DJ_NAME" value={dj} onChange={(e) => {
                              const next = [...formData.djs]; next[i] = e.target.value;
                              setFormData(p => ({...p, djs: next}));
                            }} className="industrial-input" size="small" />
                            <IconButton size="small" onClick={() => setFormData(p => ({...p, djs: p.djs.filter((_, idx) => idx !== i)}))} className="btn-delete-item"><FiTrash2/></IconButton>
                          </div>
                        ))}
                      </Box>
                    </Box>
                  </Grid>

                  {/* COLUMNA 3: MEDIA */}
                  <Grid item xs={12} md={4}>
                    <Typography className="sub-label-tech"><FiImage /> FLYER_ASSET</Typography>
                    <Box className="flyer-upload-zone-panoramic" onClick={() => fileInputRef.current.click()} style={{ backgroundImage: formData.flyer ? `url(${formData.flyer})` : 'none' }}>
                      {!formData.flyer && <FiUploadCloud size={40} />}
                      <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => {
                         const f = e.target.files[0];
                         if (f) { const r = new FileReader(); r.onloadend = () => setFormData({...formData, flyer: r.result}); r.readAsDataURL(f); }
                      }} />
                    </Box>
                  </Grid>
                </Grid>

                {/* SECCIÓN TICKETING */}
                <Box className="ticketing-section-wrapper">
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography className="sub-label-tech"><FiLayers /> INVENTORY_ARCHITECTURE</Typography>
                    <Button onClick={() => setFormData(p => ({...p, lotes: [...p.lotes, initialLote()]}))} className="btn-add-tech">+ NEW_BATCH</Button>
                  </Box>
                  <Grid container spacing={3}>
                    {formData.lotes.map((lote) => (
                      <Grid item xs={12} lg={6} key={lote.id}>
                        <Box className={`lote-container-panoramic ${!lote.isActive ? 'lote-disabled' : ''}`}>
                          <Box className="lote-header">
                            <input required value={lote.loteName} onChange={(e) => setFormData(p => ({...p, lotes: p.lotes.map(l => l.id === lote.id ? {...l, loteName: e.target.value.toUpperCase()} : l)}))} placeholder="BATCH_NAME" />
                            
                            <Box className="lote-controls">
                              <Box className="timer-box">
                                <FiClock size={14} color={lote.expirationDays > 0 ? "#FF6B00" : "#444"} />
                                <input type="number" className="timer-input-minimal" value={lote.expirationDays} onChange={(e) => setFormData(p => ({...p, lotes: p.lotes.map(l => l.id === lote.id ? {...l, expirationDays: e.target.value} : l)}))} />
                                <span>DÍAS</span>
                              </Box>
                              <FormControlLabel
                                control={<Switch size="small" checked={lote.isActive} onChange={() => setFormData(p => ({...p, lotes: p.lotes.map(l => l.id === lote.id ? {...l, isActive: !l.isActive} : l)}))} />}
                                label={<Typography sx={{ fontSize: '10px', color: lote.isActive ? '#00ff41' : '#ff3131', fontFamily: 'JetBrains Mono' }}>{lote.isActive ? 'ACT' : 'OFF'}</Typography>}
                              />
                              <IconButton onClick={() => setFormData(p => ({...p, lotes: p.lotes.filter(l => l.id !== lote.id)}))} className="btn-delete-item"><FiTrash2 size={18}/></IconButton>
                            </Box>
                          </Box>

                          <Box className="categories-grid-container">
                            {lote.categories.map((cat) => (
                              <Box key={cat.id} className="category-row-industrial">
                                <Grid container spacing={1} alignItems="center">
                                  <Grid item xs={4}><TextField required disabled={!lote.isActive} fullWidth label="TYPE" size="small" value={cat.name} onChange={(e)=>updateCategory(lote.id, cat.id, 'name', e.target.value.toUpperCase())} className="industrial-input" /></Grid>
                                  <Grid item xs={2}><TextField required disabled={!lote.isActive} fullWidth label="PRC" size="small" type="number" value={cat.price} onChange={(e)=>updateCategory(lote.id, cat.id, 'price', e.target.value)} className="industrial-input" /></Grid>
                                  <Grid item xs={2}><TextField required disabled={!lote.isActive} fullWidth label="STK" size="small" type="number" value={cat.stock} onChange={(e)=>updateCategory(lote.id, cat.id, 'stock', e.target.value)} className="industrial-input" /></Grid>
                                  <Grid item xs={3}><TextField required disabled={!lote.isActive} fullWidth label="MAX_SL" size="small" type="number" value={cat.maxStockPerSeller} onChange={(e)=>updateCategory(lote.id, cat.id, 'maxStockPerSeller', e.target.value)} className="industrial-input" /></Grid>
                                  <Grid item xs={1}><IconButton disabled={!lote.isActive} size="small" onClick={() => setFormData(p => ({...p, lotes: p.lotes.map(l => l.id === lote.id ? {...l, categories: l.categories.filter(c => c.id !== cat.id)} : l)}))} className="btn-delete-item"><FiTrash2/></IconButton></Grid>
                                </Grid>
                              </Box>
                            ))}
                          </Box>
                          <Button disabled={!lote.isActive} fullWidth onClick={() => setFormData(p => ({...p, lotes: p.lotes.map(l => l.id === lote.id ? {...l, categories: [...l.categories, initialCategory()]} : l)}))} className="btn-add-tech" sx={{mt:1}}>+ ADD_CATEGORY_UNIT</Button>
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
                  <Button type="submit" className="btn-mango-minimal vip-btn" disabled={loading} sx={{ minWidth: '240px' }}>
                    {loading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'INITIALIZE_DEPLOY'}
                  </Button>
                </Box>
              </footer>
            </form>
          </Box>
        </Fade>
      </Modal>

      <Modal open={showConfirm} onClose={() => setShowConfirm(false)} slots={{ backdrop: Backdrop }}>
        <Fade in={showConfirm}>
          <Box className="industrial-confirm-modal">
            <FiAlertCircle size={48} color="#FF6B00" className="blink" style={{ marginBottom: '15px' }} />
            <Typography variant="h6" sx={{ color: '#fff', fontFamily: 'Syncopate', mb: 1 }}>CONFIRM_DEPLOYMENT?</Typography>
            <Typography sx={{ color: '#666', mb: 4, fontFamily: 'JetBrains Mono', textAlign: 'center', fontSize: '11px' }}>ESTÁS A PUNTO DE SINCRONIZAR ESTOS DATOS CON EL CORE. ESTA ACCIÓN ES IRREVERSIBLE.</Typography>
            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
              <Button fullWidth onClick={() => setShowConfirm(false)} className="btn-abort" sx={{border:'1px solid #222 !important'}}>CANCEL</Button>
              <Button fullWidth onClick={executeDeployment} className="btn-mango-minimal vip-btn">YES_DEPLOY</Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default EventFormModal;