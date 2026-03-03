import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Grid, Snackbar, Alert, InputAdornment, Stack } from '@mui/material';
import { 
  Search as SearchIcon, 
  Add as AddIcon, 
  FileDownload as ExportIcon, 
  History as HistoryIcon,
  Inventory2 as InventoryIcon,
  WarningAmber as WarningIcon,
  Paid as PaidIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import ModalAgregarProducto from './ModalAgregarProducto';
import { useProducts } from '../../hooks/Productos/useProducts'; 
import styles from '../../styles/Products.module.css';

const Products = () => {
  const { productos, searchText, setSearchText, stats, refresh } = useProducts();
  const [modal, setModal] = useState({ open: false, data: null });
  const [snack, setSnack] = useState({ open: true, msg: '' }); // Cambiado para ver el estilo inicial

  const handleNotify = (msg) => {
    refresh();
    setModal({ open: false, data: null });
    setSnack({ open: true, msg });
  };

  return (
    <div className={styles.mainContainer}>
      <Navbar />
      <Box sx={{ p: { xs: 3, md: 6 }, maxWidth: '1600px', margin: '0 auto' }}>
        
        {/* TITULOS */}
        <header className="mb-4">
          <Typography variant="h4" className={styles.mainTitle}>Master Stock</Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
            Administración de Inventario y Activos Fijos
          </Typography>
        </header>

        {/* 1. KPIs CON COLORES REPRESENTATIVOS */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <div className={`${styles.statCard} ${styles.borderBlue}`}>
              <div className="d-flex justify-content-between">
                <span className={styles.statLabel}>Valorización</span>
                <PaidIcon sx={{ color: '#38bdf8', fontSize: 18 }} />
              </div>
              <div className={styles.statValue}>${stats.total.toLocaleString('es-AR')}</div>
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <div className={`${styles.statCard} ${styles.borderRed}`}>
              <div className="d-flex justify-content-between">
                <span className={styles.statLabel}>Stock Crítico</span>
                <WarningIcon sx={{ color: '#f43f5e', fontSize: 18 }} />
              </div>
              <div className={styles.statValue}>{stats.bajoStock} <small>items</small></div>
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <div className={`${styles.statCard} ${styles.borderGreen}`}>
              <div className="d-flex justify-content-between">
                <span className={styles.statLabel}>Total Unidades</span>
                <InventoryIcon sx={{ color: '#10b981', fontSize: 18 }} />
              </div>
              <div className={styles.statValue}>{productos.length}</div>
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <div className={styles.statCard}>
              <div className="d-flex justify-content-between">
                <span className={styles.statLabel}>Categorías</span>
                <CategoryIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
              </div>
              <div className={styles.statValue}>{new Set(productos.map(p => p.category)).size}</div>
            </div>
          </Grid>
        </Grid>

        {/* 2. PANEL DE ACCIONES (ANCHO COMPLETO) */}
        <Box className={styles.actionPanel}>
          <TextField 
            fullWidth 
            placeholder="Filtrar por nombre, código SKU o categoría..."
            className={styles.searchFullWidth}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#475569' }} />
                </InputAdornment>
              ),
            }}
          />
          
          <div className={styles.buttonRow}>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" startIcon={<HistoryIcon />} className={styles.btnSecondarySober}>
                Ver Historial
              </Button>
              <Button variant="outlined" startIcon={<ExportIcon />} className={styles.btnSecondarySober}>
                Exportar Reporte
              </Button>
            </Stack>

            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              className={styles.btnPrimarySober}
              onClick={() => setModal({ open: true, data: null })}
            >
              Nuevo Producto
            </Button>
          </div>
        </Box>

        {/* 3. TABLA */}
        <div className={styles.tableCard}>
          <div className="table-responsive">
            <table className="table table-dark table-hover m-0">
              <thead className={styles.tableHead}>
                <tr>
                  <th>Producto / Identificador</th>
                  <th>Categoría</th>
                  <th>Existencias</th>
                  <th>Valor Venta</th>
                  <th className="text-end">Operaciones</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {productos.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div className={styles.itemName}>{p.name}</div>
                      <div className={styles.itemMeta}>{p.code || 'S/SKU'} • {p.provider}</div>
                    </td>
                    <td><span className={styles.categoryTag}>{p.category}</span></td>
                    <td>
                      <span className={p.quantity < 5 ? styles.badgeRed : styles.badgeGreen}>
                        {p.quantity} {p.medida}
                      </span>
                    </td>
                    <td className={styles.itemPrice}>${p.price_final?.toLocaleString()}</td>
                    <td className="text-end">
                      <button className={styles.btnEdit} onClick={() => setModal({ open: true, data: p })}>
                        EDITAR
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Box>

      {/* MODAL */}
      {modal.open && (
        <ModalAgregarProducto 
          open={modal.open} 
          producto={modal.data} 
          onClose={() => setModal({ open: false, data: null })}
          onSave={() => handleNotify('Cambios guardados con éxito')}
          handleDelete={() => handleNotify('Item eliminado')}
        />
      )}
    </div>
  );
};

export default Products;