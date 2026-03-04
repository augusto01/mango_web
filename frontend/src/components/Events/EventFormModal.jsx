import React, { useState, useEffect, useRef } from 'react';
import { 
  Modal, Box, Typography, TextField, Button, IconButton, 
  Fade, Backdrop, Grid, CircularProgress 
} from '@mui/material';
import { 
  FiX, FiPlus, FiTrash2, FiMusic, FiMapPin, 
  FiLayers, FiUploadCloud, FiImage 
} from 'react-icons/fi';
import { useEvents } from '../../hooks/Events/useEvents';
import '../../styles/EventManagement.css';

const EventFormModal = ({ open, onClose, onSave, eventToEdit }) => {
  const { createEvent, updateEvent, loading } = useEvents();
  const fileInputRef = useRef(null);
  
  const initialLote = () => ({
    id: Date.now(),
    loteName: '',
    categories: [{ id: Date.now() + 1, name: 'GENERAL', price: 0, stock: 0, maxStockPerSeller: '' }]
  });

  const [formData, setFormData] = useState({
    name: '', location: '', address: '', date: '', djs: [''], ageLimit: '18',
    flyer: '', lotes: [initialLote()]
  });

  useEffect(() => {
    if (open && eventToEdit) setFormData(eventToEdit);
    else if (open) setFormData({
      name: '', location: '', address: '', date: '', djs: [''], ageLimit: '18',
      flyer: '', lotes: [initialLote()]
    });
  }, [open, eventToEdit]);

  // Handlers
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (eventToEdit) await updateEvent(eventToEdit._id, formData);
      else await createEvent(formData);
      onSave(); onClose();
    } catch (err) { console.error(err); }
  };

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition slots={{ backdrop: Backdrop }}>
      <Fade in={open}>
        <Box className="modal-industrial-full-wrapper">
          <IconButton onClick={onClose} className="modal-close-btn"><FiX size={32}/></IconButton>

          <form onSubmit={handleSubmit} className="event-form-layout">
            <header className="modal-header-section">
              <Typography className="sub-label-tech" color="primary">● SYSTEM_INFRASTRUCTURE_v7.2</Typography>
              <Typography variant="h3" className="syncopate-title">
                {eventToEdit ? 'OVERWRITE_DATA' : 'NEW_ENROLLMENT'}
              </Typography>
            </header>

            <Box className="form-scroll-container">
              {/* BLOQUE SUPERIOR: TRIPLE COLUMNA */}
              <Grid container spacing={4} sx={{ width: '100%', m: 0, mb: 5 }}>
                
                {/* 1. FLYER */}
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

                {/* 2. INFO & GEO */}
                <Grid item xs={12} md={4}>
                  <Box className="column-content side-borders">
                    <Typography className="sub-label-tech"><FiMapPin /> GEO_LOCATION</Typography>
                    <TextField fullWidth label="EVENT_NAME" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="industrial-input" sx={{mb:2}} />
                    <TextField fullWidth label="LOCATION_NAME" placeholder="Example: Stadium A" value={formData.location} onChange={(e)=>setFormData({...formData, location: e.target.value})} className="industrial-input" sx={{mb:2}} />
                    <TextField fullWidth label="DATE_TIME" type="datetime-local" value={formData.date} onChange={(e)=>setFormData({...formData, date: e.target.value})} className="industrial-input" InputLabelProps={{ shrink: true }} />
                  </Box>
                </Grid>

                {/* 3. DJs / LINE UP */}
                <Grid item xs={12} md={4}>
                  <Box className="column-content">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography className="sub-label-tech"><FiMusic /> LINE_UP</Typography>
                      <Button onClick={addDj} className="btn-add-tech" size="small">+ ARTIST</Button>
                    </Box>
                    <Box className="artist-scroll-area">
                      {formData.djs.map((dj, i) => (
                        <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                          <TextField fullWidth placeholder="ARTIST_NAME" value={dj} onChange={(e) => handleDjChange(i, e.target.value)} className="industrial-input" size="small" />
                          <IconButton size="small" onClick={()=>removeDj(i)} sx={{color:'#444'}}><FiTrash2/></IconButton>
                        </div>
                      ))}
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {/* BLOQUE INFERIOR: TICKETING (FULL WIDTH) */}
              <Box className="ticketing-section-wrapper">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography className="sub-label-tech"><FiLayers /> TICKETING_INFRASTRUCTURE</Typography>
                  <Button onClick={addLote} className="btn-add-tech">+ INITIALIZE_BATCH</Button>
                </Box>

                <Grid container spacing={3}>
                  {formData.lotes.map((lote) => (
                    <Grid item xs={12} lg={6} key={lote.id}>
                      <Box className="lote-container-panoramic">
                        <Box className="lote-header">
                          <TextField 
                            variant="standard" value={lote.loteName} 
                            onChange={(e) => updateLoteName(lote.id, e.target.value)}
                            placeholder="BATCH_NAME"
                            sx={{ input: { color: '#FF6B00', fontFamily: 'JetBrains Mono', fontWeight: '900', fontSize: '1.2rem' } }}
                          />
                          <IconButton color="error" onClick={() => setFormData({...formData, lotes: formData.lotes.filter(l => l.id !== lote.id)})}><FiTrash2 size={20}/></IconButton>
                        </Box>

                        {lote.categories.map((cat) => (
                          <Box key={cat.id} className="category-row-industrial">
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={4}><TextField fullWidth label="CAT" size="small" value={cat.name} onChange={(e)=>updateCategory(lote.id, cat.id, 'name', e.target.value.toUpperCase())} className="industrial-input" /></Grid>
                              <Grid item xs={2}><TextField fullWidth label="PRICE" size="small" type="number" value={cat.price} onChange={(e)=>updateCategory(lote.id, cat.id, 'price', e.target.value)} className="industrial-input" /></Grid>
                              <Grid item xs={2}><TextField fullWidth label="STOCK" size="small" type="number" value={cat.stock} onChange={(e)=>updateCategory(lote.id, cat.id, 'stock', e.target.value)} className="industrial-input" /></Grid>
                              <Grid item xs={3}><TextField fullWidth label="MAX_S" size="small" type="number" value={cat.maxStockPerSeller} onChange={(e)=>updateCategory(lote.id, cat.id, 'maxStockPerSeller', e.target.value)} className="industrial-input" /></Grid>
                              <Grid item xs={1}><IconButton size="small" sx={{color:'#ff3131'}}><FiTrash2/></IconButton></Grid>
                            </Grid>
                          </Box>
                        ))}
                        <Button startIcon={<FiPlus />} sx={{ color: '#FF6B00', mt: 1, fontFamily: 'JetBrains Mono' }} onClick={() => {
                          const newLotes = formData.lotes.map(l => l.id === lote.id ? {...l, categories: [...l.categories, {id: Date.now(), name: '', price: 0, stock: 0}]} : l);
                          setFormData({...formData, lotes: newLotes});
                        }}>ADD_CATEGORY</Button>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>

            <footer className="form-footer">
              <Button onClick={onClose} className="btn-abort">ABORT_MISSION</Button>
              <Button type="submit" className="btn-mango-minimal vip-btn" disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'DEPLOY_CHANGES'}
              </Button>
            </footer>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
};

export default EventFormModal;