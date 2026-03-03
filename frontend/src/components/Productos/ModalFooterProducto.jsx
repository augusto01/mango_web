import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../../styles/ModalFooter.css';
import '../../styles/ConfirmModal.css';

const ModalFooterProducto = ({ producto, handleSubmit, handleClose, handleDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirmDelete = () => {
    setShowConfirm(false);
    handleDelete(); // Función que elimina el producto
  };

  return (
    <>
      <Modal.Footer className="modal-footer-dark">
        <Button variant="primary" onClick={handleSubmit}>
          {producto ? 'Guardar Cambios' : 'Agregar Producto'}
        </Button>

        {producto ? (
          <Button
            className="btn-eliminar"
            onClick={() => setShowConfirm(true)}
          >
            Eliminar Producto
          </Button>
        ) : (
          <Button variant="secondary" className="ms-2" onClick={handleClose}>
            Cancelar
          </Button>
        )}
      </Modal.Footer>

      {/* Modal de Confirmación */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <div className="confirm-modal">
          <h5>Confirmar Eliminación</h5>
          <p>¿Estás seguro que deseas eliminar este producto?</p>
          <div className="confirm-modal-buttons">
            <button className="cancel-btn" onClick={() => setShowConfirm(false)}>
              Cancelar
            </button>
            <button className="confirm-btn" onClick={handleConfirmDelete}>
              Eliminar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalFooterProducto;
