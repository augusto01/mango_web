const Event = require('../models/Event');
const Sale = require('../models/Sale');

// @desc    Registrar venta presencial (Tickets + Conservadoras) e impactar stock
// @route   POST /api/sales/presencial
// @access  Private
exports.createPresencialSale = async (req, res) => {
  try {
    const {
      customerName,
      eventId,
      loteId,
      categoryId,
      coolerCategoryId,
      ticketQuantity,
      coolerQuantity,
      paymentType = 'PRESENCIAL'
    } = req.body;

    const parsedTicketQty = Math.max(0, parseInt(ticketQuantity) || 0);
    const parsedCoolerQty = Math.max(0, parseInt(coolerQuantity) || 0);

    // 1. Validar que al menos se intente procesar una unidad
    if (parsedTicketQty === 0 && parsedCoolerQty === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Debe ingresar al menos 1 entrada o 1 conservadora.' 
      });
    }

    // 2. Obtener Evento
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado' });
    }

    // 3. Obtener Lote Activo
    const lote = event.lotes.id(loteId);
    if (!lote || !lote.isActive) {
      return res.status(400).json({ 
        success: false, 
        message: 'El lote seleccionado no está activo o no existe.' 
      });
    }

    let ticketUnitPrice = 0;
    let categoryName = 'N/A';
    let coolerUnitPrice = 0;

    // 4. RESTAR STOCK DE ENTRADA / TICKET
    if (parsedTicketQty > 0) {
      const category = lote.categories.id(categoryId);
      if (!category || !category.isActive) {
        return res.status(400).json({ 
          success: false, 
          message: 'La categoría de entrada seleccionada no está disponible.' 
        });
      }

      const availableStock = category.stock - category.sold;
      if (parsedTicketQty > availableStock) {
        return res.status(400).json({ 
          success: false, 
          message: `Stock insuficiente en entradas (${availableStock} disponibles).` 
        });
      }

      // Resta stock incrementando el contador de vendidos
      category.sold += parsedTicketQty;
      if (category.sold >= category.stock) {
        category.isActive = false;
      }

      ticketUnitPrice = Number(category.price) || 0;
      categoryName = category.name;
    }

    // 5. RESTAR STOCK DE CONSERVADORA
    if (parsedCoolerQty > 0) {
      let coolerCat = coolerCategoryId ? lote.categories.id(coolerCategoryId) : null;
      if (!coolerCat) {
        coolerCat = lote.categories.find(c => c.name.trim().toUpperCase() === 'CONSERVADORA');
      }

      if (!coolerCat || !coolerCat.isActive) {
        return res.status(400).json({ 
          success: false, 
          message: 'La categoría CONSERVADORA no está disponible en este lote.' 
        });
      }

      const availableCoolerStock = coolerCat.stock - coolerCat.sold;
      if (parsedCoolerQty > availableCoolerStock) {
        return res.status(400).json({ 
          success: false, 
          message: `Stock insuficiente en conservadoras (${availableCoolerStock} disponibles).` 
        });
      }

      // Resta stock incrementando el contador de vendidos
      coolerCat.sold += parsedCoolerQty;
      if (coolerCat.sold >= coolerCat.stock) {
        coolerCat.isActive = false;
      }

      coolerUnitPrice = Number(coolerCat.price) || 0;
    }

    // 6. CÁLCULO DE TOTALES
    const totalTicketsAmount = parsedTicketQty * ticketUnitPrice;
    const totalCoolersAmount = parsedCoolerQty * coolerUnitPrice;
    const grandTotal = totalTicketsAmount + totalCoolersAmount;

    // 7. GUARDAR CAMBIOS DE STOCK EN EL EVENTO
    await event.save();

    // 8. REGISTRAR VENTA EN EL MODELO INDEPENDIENTE 'SALE'
    const newSale = await Sale.create({
      customerName: customerName || 'CONSUMIDOR FINAL',
      eventId: event._id,
      eventName: event.name,
      loteId: lote._id,
      loteName: lote.loteName,
      categoryId: categoryId || null,
      categoryName,
      ticketQuantity: parsedTicketQty,
      ticketUnitPrice,
      coolerQuantity: parsedCoolerQty,
      coolerUnitPrice,
      totalAmount: grandTotal,
      paymentType
    });

    return res.status(201).json({
      success: true,
      message: 'Venta presencial registrada y stock actualizado con éxito',
      sale: newSale
    });

  } catch (error) {
    console.error("Error al registrar venta presencial:", error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor al intentar registrar la venta',
      error: error.message
    });
  }
};

// @desc    Obtener el historial reciente de ventas presenciales
// @route   GET /api/sales/presencial
// @access  Private
exports.getPresencialSalesHistory = async (req, res) => {
  try {
    const sales = await Sale.find({ paymentType: 'PRESENCIAL' }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      sales
    });
  } catch (error) {
    console.error("Error al obtener historial de ventas:", error);
    return res.status(500).json({
      success: false,
      message: 'Error al recuperar el historial de ventas',
      error: error.message
    });
  }
};