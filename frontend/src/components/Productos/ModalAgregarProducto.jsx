import React, { useState } from 'react';
import { Modal, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { useProductForm } from '../../hooks/Productos/useProductForm';
import { useProductData } from '../../hooks/Productos/useProductData';

// Estilos e Iconos
import styles from '../../styles/Products.module.css'; 
import { 
  FaBoxOpen, FaPercentage, FaTags, FaDollarSign, FaBoxes, FaTruck, 
  FaLayerGroup, FaRulerCombined, FaFilePdf, FaCloudUploadAlt, 
  FaTrashAlt, FaPlus, FaSave, FaTimes, FaExclamationTriangle 
} from 'react-icons/fa';

const ModalAgregarProducto = ({ open, onClose, producto, onSave, handleDelete }) => {
  // Hooks de lógica
  const { formData, precioFinal, errores, handleChange, handleSubmit, handleFocus } = 
    useProductForm(producto, onSave, onClose);
  
  const { categorias, proveedores, unidades } = useProductData(open);

  // Estados locales para UI
  const [fileName, setFileName] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <>
      <Modal show={open} onHide={onClose} size="lg" centered contentClassName={styles.modalBodyDark}>
        <Modal.Header closeButton className={styles.modalHeaderDark}>
          <Modal.Title className={styles.modalTitleText}>
            {producto ? (
              <><FaSave className="me-2" /> MODIFICAR ACTIVO</>
            ) : (
              <><FaPlus className="me-2" /> REGISTRO DE PRODUCTO</>
            )}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className={styles.modalContentDark}>
          
          {/* SECCIÓN DE CARGA DE DOCUMENTO (SOLO PARA NUEVOS) */}
          {!producto && (
            <div className={styles.pdfUploadSection} style={{
              border: '2px dashed #334155',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '25px',
              background: '#0f172a'
            }}>
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <div style={{ background: '#450a0a', padding: '12px', borderRadius: '6px', marginRight: '15px' }}>
                    <FaFilePdf size={24} color="#f87171" />
                  </div>
                  <div>
                    <h6 style={{ color: '#f8fafc', margin: 0, fontSize: '0.9rem', fontWeight: '700' }}>
                      CARGA MASIVA MEDIANTE PDF
                    </h6>
                    <p style={{ color: '#64748b', fontSize: '0.75rem', margin: 0 }}>
                      {fileName ? `Archivo listo: ${fileName}` : 'Sube la factura para autocompletar campos.'}
                    </p>
                  </div>
                </div>
                <label className={styles.btnSecondarySober} style={{ cursor: 'pointer', marginBottom: 0 }}>
                  <FaCloudUploadAlt className="me-2" /> 
                  {fileName ? 'CAMBIAR PDF' : 'SELECCIONAR'}
                  <input type="file" accept=".pdf" hidden onChange={handleFileChange} />
                </label>
              </div>
            </div>
          )}

          <Form onSubmit={handleSubmit}>
            <Row className="g-4">
              {/* Nombre del Producto */}
              <Col md={12}>
                <Form.Label className={styles.inputLabel}>NOMBRE DEL PRODUCTO / DESCRIPCIÓN</Form.Label>
                <InputGroup>
                  <InputGroup.Text className={styles.darkInputGroupText}><FaBoxOpen /></InputGroup.Text>
                  <Form.Control 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    className={styles.darkInput}
                    placeholder="EJ: DISCO DURO SSD 480GB KINGSTON"
                  />
                </InputGroup>
              </Col>

              {/* Categoría, Proveedor y Medida */}
              <Col md={4}>
                <Form.Label className={styles.inputLabel}>CATEGORÍA</Form.Label>
                <InputGroup>
                  <InputGroup.Text className={styles.darkInputGroupText}><FaLayerGroup /></InputGroup.Text>
                  <Form.Select name="category" value={formData.category} onChange={handleChange} className={styles.darkInput}>
                    <option value="">SELECCIONAR</option>
                    {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
                  </Form.Select>
                </InputGroup>
              </Col>

              <Col md={4}>
                <Form.Label className={styles.inputLabel}>PROVEEDOR</Form.Label>
                <InputGroup>
                  <InputGroup.Text className={styles.darkInputGroupText}><FaTruck /></InputGroup.Text>
                  <Form.Select name="provider" value={formData.provider} onChange={handleChange} className={styles.darkInput}>
                    <option value="">SELECCIONAR</option>
                    {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre_empresa}</option>)}
                  </Form.Select>
                </InputGroup>
              </Col>

              <Col md={4}>
                <Form.Label className={styles.inputLabel}>U. MEDIDA</Form.Label>
                <InputGroup>
                  <InputGroup.Text className={styles.darkInputGroupText}><FaRulerCombined /></InputGroup.Text>
                  <Form.Select name="medida" value={formData.medida} onChange={handleChange} className={styles.darkInput}>
                    <option value="">ELEGIR</option>
                    {unidades.map(u => <option key={u.id} value={u.nombre}>{u.nombre}</option>)}
                  </Form.Select>
                </InputGroup>
              </Col>

              {/* Fila Numérica */}
              <Col md={3}>
                <Form.Label className={styles.inputLabel}>STOCK</Form.Label>
                <InputGroup>
                  <InputGroup.Text className={styles.darkInputGroupText}><FaBoxes /></InputGroup.Text>
                  <Form.Control type="number" name="quantity" value={formData.quantity} onChange={handleChange} onFocus={handleFocus} className={styles.darkInput} />
                </InputGroup>
              </Col>

              <Col md={3}>
                <Form.Label className={styles.inputLabel}>COSTO NETO</Form.Label>
                <InputGroup>
                  <InputGroup.Text className={styles.darkInputGroupText}><FaDollarSign /></InputGroup.Text>
                  <Form.Control type="number" name="price_siva" value={formData.price_siva} onChange={handleChange} onFocus={handleFocus} className={styles.darkInput} />
                </InputGroup>
              </Col>

              <Col md={3}>
                <Form.Label className={styles.inputLabel}>MARGEN %</Form.Label>
                <InputGroup>
                  <InputGroup.Text className={styles.darkInputGroupText}><FaPercentage /></InputGroup.Text>
                  <Form.Control type="number" name="por_marginal" value={formData.por_marginal} onChange={handleChange} onFocus={handleFocus} className={styles.darkInput} />
                </InputGroup>
              </Col>

              <Col md={3}>
                <Form.Label className={styles.inputLabel}>DESC. %</Form.Label>
                <InputGroup>
                  <InputGroup.Text className={styles.darkInputGroupText}><FaTags /></InputGroup.Text>
                  <Form.Control type="number" name="discount" value={formData.discount} onChange={handleChange} onFocus={handleFocus} className={styles.darkInput} />
                </InputGroup>
              </Col>
            </Row>

            <div className={styles.modalPriceBadge} style={{ marginTop: '30px' }}>
              <div className="d-flex justify-content-between align-items-center">
                <span className={styles.priceLabel}>VALOR FINAL DE MERCADO</span>
                <span className={styles.finalPriceText}>
                  $ {precioFinal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </Form>
        </Modal.Body>

        <Modal.Footer className={styles.modalFooterDark}>
          <button className={styles.btnSecondarySober} onClick={onClose} type="button">
            <FaTimes className="me-2" /> CANCELAR
          </button>
          
          {producto && (
            <button className={styles.btnDangerSober} onClick={() => setShowConfirm(true)} type="button">
              <FaTrashAlt className="me-2" /> ELIMINAR
            </button>
          )}

          <button className={styles.btnPrimarySober} onClick={handleSubmit} type="button">
            {producto ? (
              <><FaSave className="me-2" /> GUARDAR CAMBIOS</>
            ) : (
              <><FaPlus className="me-2" /> REGISTRAR PRODUCTO</>
            )}
          </button>
        </Modal.Footer>
      </Modal>

      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered contentClassName={styles.modalBodyDark}>
        <Modal.Body className="text-center p-5">
          <FaExclamationTriangle size={48} color="#ef4444" className="mb-4" />
          <h5 className={styles.modalTitleText}>¿CONFIRMAR ELIMINACIÓN?</h5>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>ESTA ACCIÓN REMOVERÁ EL ÍTEM DE FORMA PERMANENTE.</p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <button className={styles.btnSecondarySober} onClick={() => setShowConfirm(false)}>VOLVER</button>
            <button className={styles.btnDangerSober} onClick={() => { handleDelete(); setShowConfirm(false); }}>
               SÍ, ELIMINAR
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalAgregarProducto;