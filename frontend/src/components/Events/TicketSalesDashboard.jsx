import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, Typography, Grid, Card, CardContent, TextField, 
  MenuItem, Button, Modal, Fade, Backdrop, CircularProgress, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip,
  Snackbar, Alert 
} from '@mui/material';
import { FiTag, FiPackage, FiLayers, FiPlus, FiX, FiCheck, FiEye, FiUser } from 'react-icons/fi';
import '../../styles/TicketSalesDashboard.css';

const TicketSalesDashboard = ({ events = [], salesHistory = [], onRefreshData, currentUser }) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || '';

  const activeOperator = useMemo(() => {
    if (currentUser?.name) return currentUser.name;
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        return parsed.name || parsed.username || 'SISTEMA POS';
      } catch (e) {
        return 'SISTEMA POS';
      }
    }
    return 'SISTEMA POS';
  }, [currentUser]);

  // --- FILTROS DE HISTORIAL Y AUDITORÍA ---
  const [selectedEventFilter, setSelectedEventFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [exactDateFilter, setExactDateFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('ALL');

  // --- ESTADOS LOCALES, MODALES Y TOAST AUTO-DISMISS ---
  const [openModal, setOpenModal] = useState(false);
  const [loadingSale, setLoadingSale] = useState(false);
  const [localSales, setLocalSales] = useState([]);
  const [selectedSaleDetail, setSelectedSaleDetail] = useState(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);

  // ESTADO PARA EL AVISO AUTOMÁTICO INFERIOR (SIN MOUSE)
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchSalesFromDB = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/sales/presencial`);
        if (response.data && response.data.success) {
          setLocalSales(response.data.sales);
        }
      } catch (error) {
        console.error("Error al recuperar el historial desde BD:", error);
      }
    };
    fetchSalesFromDB();
  }, [API_BASE_URL]);

  const allSales = useMemo(() => [...localSales, ...salesHistory], [localSales, salesHistory]);

  // --- FORMULARIO DE VENTA ---
  const [saleForm, setSaleForm] = useState({
    customerName: 'CONSUMIDOR FINAL',
    eventId: events[0]?._id || '',
    loteId: events[0]?.lotes?.find(l => l.isActive)?._id || '',
    categoryId: '',
    ticketQuantity: 1,
    coolerQuantity: 0,
    paymentMethod: 'EFECTIVO'
  });

  const currentEvent = useMemo(() => events.find(e => e._id === saleForm.eventId), [events, saleForm.eventId]);
  const currentLotes = useMemo(() => currentEvent?.lotes?.filter(l => l.isActive) || [], [currentEvent]);
  const currentLote = useMemo(() => currentLotes.find(l => (l._id || l.id) === saleForm.loteId), [currentLotes, saleForm.loteId]);

  const availableCategoryFilterOptions = useMemo(() => {
    const options = new Set();
    events.forEach(evt => {
      evt.lotes?.forEach(lote => {
        if (lote.loteName) options.add(`LOTE: ${lote.loteName}`);
        lote.categories?.forEach(cat => cat.name && options.add(cat.name.toUpperCase()));
      });
    });
    return Array.from(options);
  }, [events]);

  const coolerCategory = useMemo(() => {
    const categories = currentLote?.categories?.filter(c => c.isActive) || [];
    return categories.find(c => c.name.trim().toUpperCase() === 'CONSERVADORA');
  }, [currentLote]);

  const coolerUnitPrice = Number(coolerCategory?.price) || 0;

  const maxCoolersAllowed = useMemo(() => {
    if (coolerCategory?.maxTicketsPerPurchase !== undefined) return Number(coolerCategory.maxTicketsPerPurchase);
    if (currentEvent?.maxTicketsPerPurchase !== undefined) return Number(currentEvent.maxTicketsPerPurchase);
    return Infinity;
  }, [coolerCategory, currentEvent]);

  const ticketCategories = useMemo(() => {
    const categories = currentLote?.categories?.filter(c => c.isActive) || [];
    return categories.filter(c => c.name.trim().toUpperCase() !== 'CONSERVADORA');
  }, [currentLote]);

  const currentCategory = useMemo(() => 
    ticketCategories.find(c => (c._id || c.id) === saleForm.categoryId) || ticketCategories[0], 
  [ticketCategories, saleForm.categoryId]);

  const maxTicketsAllowed = useMemo(() => {
    if (currentCategory?.maxTicketsPerPurchase !== undefined) return Number(currentCategory.maxTicketsPerPurchase);
    if (currentEvent?.maxTicketsPerPurchase !== undefined) return Number(currentEvent.maxTicketsPerPurchase);
    return Infinity;
  }, [currentCategory, currentEvent]);

  const ticketUnitPrice = currentCategory ? Number(currentCategory.price) || 0 : 0;
  const grandTotal = (Number(saleForm.ticketQuantity || 0) * ticketUnitPrice) + (Number(saleForm.coolerQuantity || 0) * coolerUnitPrice);

  const filteredSales = useMemo(() => {
    return allSales.filter(sale => {
      const matchEvent = selectedEventFilter === 'ALL' || sale.eventId === selectedEventFilter;
      
      let matchDate = true;
      const saleDate = new Date(sale.createdAt || sale.date);
      const now = new Date();

      if (exactDateFilter) {
        matchDate = saleDate.toISOString().split('T')[0] === exactDateFilter;
      } else if (dateFilter === 'TODAY') {
        matchDate = saleDate.toDateString() === now.toDateString();
      } else if (dateFilter === 'WEEK') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        matchDate = saleDate >= weekAgo;
      } else if (dateFilter === 'MONTH') {
        matchDate = saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
      }

      let matchCategory = true;
      if (categoryFilter !== 'ALL') {
        if (categoryFilter.startsWith('LOTE:')) {
          matchCategory = sale.loteName?.trim().toUpperCase() === categoryFilter.replace('LOTE:', '').trim();
        } else if (categoryFilter === 'CONSERVADORA') {
          matchCategory = Number(sale.coolerQuantity) > 0;
        } else {
          matchCategory = sale.categoryName?.trim().toUpperCase() === categoryFilter;
        }
      }

      let matchPayment = true;
      if (paymentMethodFilter !== 'ALL') {
        const rawMethod = (sale.paymentMethod || sale.paymentType || '').toUpperCase();
        const normalized = (rawMethod === 'PRESENCIAL' || rawMethod === '') ? 'EFECTIVO' : rawMethod;
        matchPayment = normalized === paymentMethodFilter;
      }

      return matchEvent && matchDate && matchCategory && matchPayment;
    });
  }, [allSales, selectedEventFilter, dateFilter, exactDateFilter, categoryFilter, paymentMethodFilter]);

  const kpiData = useMemo(() => {
    return filteredSales.reduce((acc, sale) => {
      acc.totalTickets += Number(sale.ticketQuantity || 0);
      acc.totalCoolers += Number(sale.coolerQuantity || 0);
      acc.totalRevenue += Number(sale.totalAmount || 0);
      return acc;
    }, { totalTickets: 0, totalCoolers: 0, totalRevenue: 0 });
  }, [filteredSales]);

  const resetForm = () => {
    const defaultEvt = events[0] || null;
    const defaultLote = defaultEvt?.lotes?.find(l => l.isActive) || null;
    const availableCats = defaultLote?.categories?.filter(c => c.isActive && c.name.trim().toUpperCase() !== 'CONSERVADORA') || [];

    setSaleForm({
      customerName: 'CONSUMIDOR FINAL',
      eventId: defaultEvt ? defaultEvt._id : '',
      loteId: defaultLote ? (defaultLote._id || defaultLote.id) : '',
      categoryId: availableCats[0] ? (availableCats[0]._id || availableCats[0].id) : '',
      ticketQuantity: 1,
      coolerQuantity: 0,
      paymentMethod: 'EFECTIVO'
    });
  };

  const handleOpenModal = () => {
    resetForm();
    setOpenModal(true);
  };

  // --- PROCESAR VENTA ---
  const handleSubmitSale = async (e) => {
    e.preventDefault();
    if (loadingSale) return;

    setLoadingSale(true);
    try {
      const payload = {
        customerName: saleForm.customerName.trim() || 'CONSUMIDOR FINAL',
        eventId: saleForm.eventId,
        loteId: saleForm.loteId,
        categoryId: currentCategory?._id || currentCategory?.id || saleForm.categoryId,
        coolerCategoryId: coolerCategory?._id || coolerCategory?.id || null,
        ticketQuantity: Number(saleForm.ticketQuantity || 0),
        coolerQuantity: Number(saleForm.coolerQuantity || 0),
        ticketUnitPrice,
        coolerUnitPrice,
        totalAmount: grandTotal,
        paymentType: saleForm.paymentMethod, 
        paymentMethod: saleForm.paymentMethod,
        soldBy: activeOperator
      };

      const response = await axios.post(`${API_BASE_URL}/sales/presencial`, payload);

      if (response.data && response.data.success) {
        setLocalSales(prev => [response.data.sale, ...prev]);
        if (typeof onRefreshData === 'function') onRefreshData();
        
        // MUESTRA EL AVISO EN LA PARTE INFERIOR Y SE CIERRA SOLO EN 2 SEG (SIN USAR EL MOUSE)
        setToast({
          open: true,
          message: `¡Venta de $${grandTotal.toLocaleString()} registrada con éxito!`,
          severity: 'success'
        });

        resetForm();
      }
    } catch (err) {
      console.error("Error al procesar la venta:", err.response?.data || err);
      setToast({
        open: true,
        message: err.response?.data?.message || "Error al registrar la venta",
        severity: 'error'
      });
    } finally {
      setLoadingSale(false);
    }
  };

  return (
    <Box className="pos-compact-container">
      <Box className="pos-watermark" />

      {/* 1. SECCIÓN SUPERIOR DE FILTROS Y KPIS */}
      <Box sx={{ mb: 1.5, width: '100%', position: 'relative', zIndex: 1 }}>
        <Grid container spacing={1.5} alignItems="stretch" justifyContent="center">
          
          <Grid item xs={12} sm={4.5}>
            <Box className="pos-card-minimal" sx={{ height: '100%', display: 'flex', alignItems: 'center', px: 1, py: 0.5 }}>
              <Grid container spacing={0.5} alignItems="center">
                <Grid item xs={2.4}>
                  <TextField
                    select fullWidth size="small" label="EVENTO"
                    value={selectedEventFilter} onChange={(e) => setSelectedEventFilter(e.target.value)}
                    className="industrial-input-small"
                  >
                    <MenuItem value="ALL">TODOS</MenuItem>
                    {events.map(evt => <MenuItem key={evt._id} value={evt._id}>{evt.name}</MenuItem>)}
                  </TextField>
                </Grid>

                <Grid item xs={2.4}>
                  <TextField
                    select fullWidth size="small" label="CATEGORÍA"
                    value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
                    className="industrial-input-small"
                  >
                    <MenuItem value="ALL">TODAS</MenuItem>
                    {availableCategoryFilterOptions.map((opt, idx) => <MenuItem key={idx} value={opt}>{opt}</MenuItem>)}
                  </TextField>
                </Grid>

                <Grid item xs={2.4}>
                  <TextField
                    select fullWidth size="small" label="PAGO"
                    value={paymentMethodFilter} onChange={(e) => setPaymentMethodFilter(e.target.value)}
                    className="industrial-input-small"
                  >
                    <MenuItem value="ALL">TODOS</MenuItem>
                    <MenuItem value="EFECTIVO">EFECTIVO</MenuItem>
                    <MenuItem value="TRANSFERENCIA">TRANSFERENCIA</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={2.4}>
                  <TextField
                    select fullWidth size="small" label="PERÍODO"
                    value={dateFilter} disabled={Boolean(exactDateFilter)}
                    onChange={(e) => setDateFilter(e.target.value)} className="industrial-input-small"
                  >
                    <MenuItem value="ALL">HISTÓRICO</MenuItem>
                    <MenuItem value="TODAY">HOY</MenuItem>
                    <MenuItem value="WEEK">7 DÍAS</MenuItem>
                    <MenuItem value="MONTH">MES</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={2.4}>
                  <TextField
                    type="date" fullWidth size="small" label="DÍA"
                    value={exactDateFilter} onChange={(e) => setExactDateFilter(e.target.value)}
                    InputLabelProps={{ shrink: true }} className="industrial-input-small"
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12} sm={1.8}>
            <Card className="pos-kpi-compact" sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CardContent sx={{ p: '8px 12px !important', textAlign: 'center', width: '100%' }}>
                <Typography className="sub-label-tech" sx={{ fontSize: '8px', color: '#777' }}>TICKETS VENDIDOS</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff', fontFamily: 'JetBrains Mono', lineHeight: 1.1 }}>
                  {kpiData.totalTickets}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={1.8}>
            <Card className="pos-kpi-compact" sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CardContent sx={{ p: '8px 12px !important', textAlign: 'center', width: '100%' }}>
                <Typography className="sub-label-tech" sx={{ fontSize: '8px', color: '#777' }}>CONSERVADORAS</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff', fontFamily: 'JetBrains Mono', lineHeight: 1.1 }}>
                  {kpiData.totalCoolers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={2.1}>
            <Card className="pos-kpi-compact highlight" sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CardContent sx={{ p: '8px 12px !important', textAlign: 'center', width: '100%' }}>
                <Typography className="sub-label-tech" sx={{ fontSize: '8px', color: '#FF6B00' }}>TOTAL RECAUDADO</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#00ff41', fontFamily: 'JetBrains Mono', lineHeight: 1.1 }}>
                  ${kpiData.totalRevenue.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={1.8}>
            <Button
              onClick={handleOpenModal} className="btn-pos-minimal"
              startIcon={<FiPlus />} sx={{ width: '100%', height: '100%', minHeight: '52px', py: 0 }}
            >
              NUEVA VENTA
            </Button>
          </Grid>

        </Grid>
      </Box>

      {/* 2. TABLA CON "EFECTIVO" FORZADO EN LUGAR DE "PRESENCIAL" */}
      <Box className="pos-card-minimal pos-table-compact" sx={{ width: '100%', height: 'calc(100vh - 190px)', position: 'relative', zIndex: 1 }}>
        <Typography className="sub-label-tech" sx={{ mb: 1, color: '#888', fontSize: '10px', display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <FiLayers color="#FF6B00" /> HISTORIAL RECIENTE DE OPERACIONES
        </Typography>

        <TableContainer component={Paper} sx={{ background: 'transparent', boxShadow: 'none', height: '90%' }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow sx={{ '& th': { color: '#FF6B00', background: '#0a0a0a', fontFamily: 'JetBrains Mono', borderColor: '#1a1a1a', fontSize: '12px', fontWeight: 'bold', py: 0.8 } }}>
                <TableCell>CLIENTE</TableCell>
                <TableCell align="center">TICKETS</TableCell>
                <TableCell align="center">CONSERVADORA</TableCell>
                <TableCell align="center">MEDIO DE PAGO</TableCell>
                <TableCell align="center">VENDIDO POR</TableCell>
                <TableCell align="right">TOTAL COBRADO</TableCell>
                <TableCell align="center">FECHA Y HORA</TableCell>
                <TableCell align="center">ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ color: '#555', py: 3, fontFamily: 'JetBrains Mono', fontSize: '13px' }}>
                    SIN REGISTROS DE VENTA
                  </TableCell>
                </TableRow>
              ) : (
                filteredSales.map((sale, idx) => {
                  const saleDateObj = new Date(sale.createdAt || sale.date);
                  const formattedDate = saleDateObj.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                  const formattedTime = saleDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  // SI DICE PRESENCIAL O VIENE VACÍO, MOSTRAR "EFECTIVO"
                  const rawMethod = (sale.paymentMethod || sale.paymentType || '').toUpperCase();
                  const paymentDisplay = (rawMethod === 'PRESENCIAL' || !rawMethod) ? 'EFECTIVO' : rawMethod;

                  return (
                    <TableRow key={sale._id || idx} sx={{ '& td': { color: '#ccc', borderColor: '#141414', fontFamily: 'JetBrains Mono', fontSize: '13px', py: 0.8 } }}>
                      <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>{sale.customerName || 'CONSUMIDOR FINAL'}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: '600' }}>{sale.ticketQuantity}x</TableCell>
                      <TableCell align="center" sx={{ color: sale.coolerQuantity > 0 ? '#00ff41' : '#666' }}>
                        {sale.coolerQuantity > 0 ? `${sale.coolerQuantity}x` : '-'}
                      </TableCell>
                      <TableCell align="center">
                        <span className={`badge-payment ${paymentDisplay === 'TRANSFERENCIA' ? 'transfer' : 'cash'}`}>
                          {paymentDisplay}
                        </span>
                      </TableCell>
                      <TableCell align="center" sx={{ color: '#aaa', fontSize: '12px' }}>
                        {sale.soldBy || activeOperator}
                      </TableCell>
                      <TableCell align="right" sx={{ color: '#00ff41', fontWeight: 'bold', fontSize: '14px' }}>
                        ${sale.totalAmount?.toLocaleString()}
                      </TableCell>
                      <TableCell align="center" sx={{ color: '#aaa', fontSize: '12px' }}>
                        {formattedDate} - {formattedTime} hs
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Ver detalle de la venta">
                          <IconButton 
                            onClick={() => { setSelectedSaleDetail(sale); setOpenDetailModal(true); }} 
                            sx={{ color: '#FF6B00', p: 0.5, '&:hover': { background: 'rgba(255, 107, 0, 0.15)' } }}
                          >
                            <FiEye size={18} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* 3. MODAL POS */}
      <Modal open={openModal} onClose={() => !loadingSale && setOpenModal(false)} slots={{ backdrop: Backdrop }}>
        <Fade in={openModal}>
          <Box 
            className="industrial-confirm-modal" 
            sx={{ 
              maxWidth: 580, width: '95%', background: '#0a0a0a', border: '1px solid #FF6B00', 
              p: 2.5, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, width: '100%' }}>
              <Typography className="sub-label-tech" sx={{ color: '#FF6B00', fontSize: '11px !important', pt: 0.5 }}>
                ● POS_TERMINAL // REGISTRO DE VENTA
              </Typography>
              <IconButton onClick={() => setOpenModal(false)} disabled={loadingSale} sx={{ color: '#888', p: 0.5, ml: 'auto', '&:hover': { color: '#fff' } }}>
                <FiX size={20} />
              </IconButton>
            </Box>

            <form onSubmit={handleSubmitSale}>
              <Grid container spacing={1.5}>

                <Grid item xs={12} sm={7}>
                  <TextField
                    fullWidth size="small" label="NOMBRE DEL CLIENTE"
                    value={saleForm.customerName}
                    onChange={(e) => setSaleForm({ ...saleForm, customerName: e.target.value.toUpperCase() })}
                    className="industrial-input-small"
                  />
                </Grid>

                <Grid item xs={12} sm={5}>
                  <TextField
                    select required fullWidth size="small" label="MEDIO DE PAGO"
                    value={saleForm.paymentMethod}
                    onChange={(e) => setSaleForm({ ...saleForm, paymentMethod: e.target.value })}
                    className="industrial-input-small"
                  >
                    <MenuItem value="EFECTIVO">EFECTIVO</MenuItem>
                    <MenuItem value="TRANSFERENCIA">TRANSFERENCIA</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <Box className="modal-section-box">
                    <Typography className="modal-section-title">
                      <FiTag color="#FF6B00" size={14} /> SECCIÓN 1: ENTRADAS / ANTICIPADAS
                    </Typography>
                    
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <TextField
                          select required fullWidth size="small" label="EVENTO"
                          value={saleForm.eventId}
                          onChange={(e) => {
                            const evtId = e.target.value;
                            const evt = events.find(x => x._id === evtId);
                            const firstLote = evt?.lotes?.find(l => l.isActive);
                            const availableCats = firstLote?.categories?.filter(c => c.isActive && c.name.trim().toUpperCase() !== 'CONSERVADORA') || [];
                            setSaleForm({
                              ...saleForm,
                              eventId: evtId,
                              loteId: firstLote ? (firstLote._id || firstLote.id) : '',
                              categoryId: availableCats[0] ? (availableCats[0]._id || availableCats[0].id) : ''
                            });
                          }}
                          className="industrial-input-small"
                        >
                          {events.map(evt => <MenuItem key={evt._id} value={evt._id}>{evt.name}</MenuItem>)}
                        </TextField>
                      </Grid>

                      <Grid item xs={6}>
                        <TextField
                          select required fullWidth size="small" label="LOTE"
                          value={saleForm.loteId}
                          onChange={(e) => {
                            const loteId = e.target.value;
                            const lote = currentLotes.find(l => (l._id || l.id) === loteId);
                            const availableCats = lote?.categories?.filter(c => c.isActive && c.name.trim().toUpperCase() !== 'CONSERVADORA') || [];
                            setSaleForm({
                              ...saleForm,
                              loteId,
                              categoryId: availableCats[0] ? (availableCats[0]._id || availableCats[0].id) : ''
                            });
                          }}
                          className="industrial-input-small"
                        >
                          {currentLotes.map(lote => (
                            <MenuItem key={lote._id || lote.id} value={lote._id || lote.id}>
                              {lote.loteName}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      <Grid item xs={6}>
                        <TextField
                          select required fullWidth size="small" label="CATEGORÍA ENTRADA"
                          value={saleForm.categoryId || (ticketCategories[0]?._id || ticketCategories[0]?.id || '')}
                          onChange={(e) => setSaleForm({ ...saleForm, categoryId: e.target.value })}
                          className="industrial-input-small"
                        >
                          {ticketCategories.map(cat => (
                            <MenuItem key={cat._id || cat.id} value={cat._id || cat.id}>
                              {cat.name} (${cat.price})
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          required fullWidth size="small" type="number" label="CANTIDAD DE ENTRADAS"
                          value={saleForm.ticketQuantity}
                          onChange={(e) => {
                            let val = parseInt(e.target.value) || 0;
                            if (val < 0) val = 0;
                            if (isFinite(maxTicketsAllowed) && val > maxTicketsAllowed) val = maxTicketsAllowed;
                            setSaleForm({ ...saleForm, ticketQuantity: val });
                          }}
                          inputProps={{ min: 0, max: isFinite(maxTicketsAllowed) ? maxTicketsAllowed : undefined }}
                          className="industrial-input-small"
                          helperText={isFinite(maxTicketsAllowed) ? `Límite configurado: ${maxTicketsAllowed} entradas` : 'Sin límite configurado'}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box className="modal-section-box">
                    <Typography className="modal-section-title">
                      <FiPackage color="#00ff41" size={14} /> SECCIÓN 2: ADICIONAL CONSERVADORA
                    </Typography>

                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth size="small" type="number"
                          label={coolerCategory ? `CANTIDAD CONSERVADORAS ($${coolerUnitPrice.toLocaleString()} c/u)` : 'SIN CONSERVADORA DISPONIBLE'}
                          disabled={!coolerCategory}
                          value={saleForm.coolerQuantity}
                          onChange={(e) => {
                            let val = parseInt(e.target.value) || 0;
                            if (val < 0) val = 0;
                            if (isFinite(maxCoolersAllowed) && val > maxCoolersAllowed) val = maxCoolersAllowed;
                            setSaleForm({ ...saleForm, coolerQuantity: val });
                          }}
                          inputProps={{ min: 0, max: isFinite(maxCoolersAllowed) ? maxCoolersAllowed : undefined }}
                          className="industrial-input-small"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box className="pos-total-minimal">
                    <Box>
                      <Typography variant="caption" sx={{ color: '#aaa', fontFamily: 'JetBrains Mono', fontSize: '0.72rem', display: 'block' }}>
                        DESGLOSE: {saleForm.ticketQuantity} Entrada(s) + {saleForm.coolerQuantity} Conservadora(s) // PAGO: {saleForm.paymentMethod}
                      </Typography>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#00ff41', fontFamily: 'JetBrains Mono' }}>
                      ${grandTotal.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sx={{ mt: 0.5 }}>
                  <Button
                    type="submit" fullWidth
                    disabled={loadingSale || (saleForm.ticketQuantity === 0 && saleForm.coolerQuantity === 0)}
                    className="btn-pos-minimal" startIcon={!loadingSale ? <FiCheck size={18} /> : null}
                    sx={{ width: '100%', py: 1.2 }}
                  >
                    {loadingSale ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                        <CircularProgress size={18} sx={{ color: '#FF6B00' }} />
                        <span>PROCESANDO VENTA...</span>
                      </Box>
                    ) : (
                      `EFECTUAR VENTA ($${grandTotal.toLocaleString()})`
                    )}
                  </Button>
                </Grid>

              </Grid>
            </form>
          </Box>
        </Fade>
      </Modal>

      {/* 4. MODAL DETALLE DE VENTA */}
      <Modal open={openDetailModal} onClose={() => setOpenDetailModal(false)} slots={{ backdrop: Backdrop }}>
        <Fade in={openDetailModal}>
          <Box 
            className="industrial-confirm-modal" 
            sx={{ 
              maxWidth: 480, width: '90%', background: '#0a0a0a', border: '1px solid #FF6B00', 
              p: 2.5, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, width: '100%' }}>
              <Typography className="sub-label-tech" sx={{ color: '#FF6B00', fontSize: '12px !important', pt: 0.5 }}>
                ● POS_TERMINAL // DETALLE DE TRANSACCIÓN
              </Typography>
              <IconButton onClick={() => setOpenDetailModal(false)} sx={{ color: '#888', p: 0.5, ml: 'auto', '&:hover': { color: '#fff' } }}>
                <FiX size={20} />
              </IconButton>
            </Box>

            {selectedSaleDetail && (
              <Box sx={{ fontFamily: 'JetBrains Mono', color: '#ccc', display: 'flex', flexDirection: 'column', gap: 1.2, fontSize: '0.85rem' }}>
                <Box sx={{ borderBottom: '1px solid #222', pb: 1 }}>
                  <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>CLIENTE</Typography>
                  <Typography sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>
                    {selectedSaleDetail.customerName || 'CONSUMIDOR FINAL'}
                  </Typography>
                </Box>

                <Box sx={{ borderBottom: '1px solid #222', pb: 1 }}>
                  <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>OPERADOR / VENDIDO POR</Typography>
                  <Typography sx={{ color: '#00e5ff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <FiUser size={14} /> {selectedSaleDetail.soldBy || activeOperator}
                  </Typography>
                </Box>

                <Box sx={{ borderBottom: '1px solid #222', pb: 1 }}>
                  <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>EVENTO / LOTE / CATEGORÍA</Typography>
                  <Typography sx={{ color: '#FF6B00', fontWeight: 'bold' }}>
                    {selectedSaleDetail.eventName || 'N/A'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#aaa', display: 'block' }}>
                    {selectedSaleDetail.loteName ? `LOTE: ${selectedSaleDetail.loteName}` : ''} 
                    {selectedSaleDetail.categoryName ? ` | CATEGORÍA: ${selectedSaleDetail.categoryName}` : ''}
                  </Typography>
                </Box>

                <Box sx={{ borderBottom: '1px solid #222', pb: 1 }}>
                  <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>DESGLOSE DE PRODUCTOS</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 0.5 }}>
                    <span>Entradas ({selectedSaleDetail.ticketQuantity || 0}x)</span>
                    <span sx={{ color: '#fff' }}>${((selectedSaleDetail.ticketQuantity || 0) * (selectedSaleDetail.ticketUnitPrice || 0)).toLocaleString()}</span>
                  </Box>
                  {selectedSaleDetail.coolerQuantity > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 0.5 }}>
                      <span>Conservadoras ({selectedSaleDetail.coolerQuantity}x)</span>
                      <span sx={{ color: '#00ff41' }}>${((selectedSaleDetail.coolerQuantity || 0) * (selectedSaleDetail.coolerUnitPrice || 0)).toLocaleString()}</span>
                    </Box>
                  )}
                </Box>

                <Box sx={{ borderBottom: '1px solid #222', pb: 1 }}>
                  <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>MEDIO DE PAGO Y FECHA</Typography>
                  <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>
                    {((selectedSaleDetail.paymentMethod || selectedSaleDetail.paymentType || '') === 'PRESENCIAL' || !selectedSaleDetail.paymentMethod) ? 'EFECTIVO' : selectedSaleDetail.paymentMethod.toUpperCase()}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#aaa', display: 'block' }}>
                    {new Date(selectedSaleDetail.createdAt || selectedSaleDetail.date).toLocaleDateString('es-AR')} - {new Date(selectedSaleDetail.createdAt || selectedSaleDetail.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} hs
                  </Typography>
                </Box>

                <Box sx={{ background: '#000', p: 1.5, border: '1px solid #333', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <Typography sx={{ color: '#aaa', fontSize: '0.8rem' }}>TOTAL COBRADO:</Typography>
                  <Typography sx={{ color: '#00ff41', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    ${selectedSaleDetail.totalAmount?.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>

      {/* 5. AVISO EN LA PARTE INFERIOR (TOAST AUTOMÁTICO DE 2 SEGUNDOS - SIN MOUSE) */}
      <Snackbar
        open={toast.open}
        autoHideDuration={2000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={toast.severity} 
          variant="filled" 
          sx={{ 
            fontFamily: 'JetBrains Mono', 
            fontWeight: 'bold', 
            fontSize: '0.9rem',
            background: toast.severity === 'success' ? '#00ff41' : '#ff1744',
            color: '#000',
            boxShadow: '0 4px 20px rgba(0,0,0,0.8)'
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default TicketSalesDashboard;