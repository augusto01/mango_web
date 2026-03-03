const Product = require('../Models/Producto');

//=================== GENERAR CÓDIGO =========================//
const generateProductCode = async () => {
  try {
    const lastProduct = await Product.findOne().sort({ _id: -1 });
    const lastCode = lastProduct?.code ? parseInt(lastProduct.code, 10) : 0;
    const nextCode = (lastCode + 1).toString().padStart(8, '0');
    return nextCode;
  } catch (error) {
    console.error('Error generando código del producto:', error);
    return null;
  }
};

//====================== CREAR PRODUCTO ==========================//
exports.createProduct = async (req, res) => {
  try {
    const empresaId = req.user?.empresa?.id;
    if (!empresaId) {
      return res.status(400).json({ message: 'No se encontró el ID de la empresa en el token' });
    }

    const {
      name,
      category,
      description,
      quantity,
      medida,
      provider,
      price_siva,
      price_usd,
      price_final,
      por_descuento,
      por_marginal,
    } = req.body;

    if (!name || !category || quantity === undefined) {
      return res.status(400).json({
        message: 'Los campos "name", "category" y "quantity" son obligatorios.',
      });
    }

    const productCode = await generateProductCode();
    if (!productCode) {
      return res.status(500).json({
        message: 'No se pudo generar el código del producto.',
      });
    }

    const newProduct = new Product({
      code: productCode,
      name,
      description,
      por_descuento,
      por_marginal,
      category,
      quantity,
      medida: medida || '',
      provider: provider || '',
      price_siva: price_siva || 0,
      price_usd: price_usd || 0,
      price_final: price_final || 0,
      create_at: new Date(),
      empresa: empresaId,
      active: true,
    });

    await newProduct.save();

    res.status(201).json({
      message: 'Producto creado exitosamente',
      product: newProduct,
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({
      message: 'Ocurrió un error al crear el producto.',
      error: error.message,
    });
  }
};

//=================== EDITAR PRODUCTO ==================//
exports.editProduct = async (req, res) => {
  try {
    const { _id } = req.params;
    const empresaId = req.user?.empresa?.id;
    if (!empresaId) {
      return res.status(400).json({ message: 'No se encontró el ID de la empresa en el token' });
    }

    const {
      name,
      category,
      description,
      quantity,
      medida,
      provider,
      price_siva,
      price_usd,
      price_final,
      por_descuento,
      por_marginal,
    } = req.body;

    const product = await Product.findOne({ _id, empresa: empresaId });
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado para esta empresa' });
    }

    // Actualizar campos
    product.name = name;
    product.category = category;
    product.description = description;
    product.por_descuento = por_descuento;
    product.por_marginal = por_marginal;
    product.quantity = quantity;
    product.medida = medida;
    product.provider = provider;
    product.price_siva = price_siva;
    product.price_usd = price_usd;
    product.price_final = price_final;

    await product.save();

    res.status(200).json({
      message: 'Producto actualizado correctamente',
      product,
    });
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    return res.status(400).json({
      message: 'Error al actualizar producto',
      errors: error.errors || error.message,
    });
  }
};

//==================== DESACTIVAR PRODUCTO (BAJA LÓGICA) =====================//
exports.desactivateProduct = async (req, res) => {
  try {
    const { _id } = req.params;
    const empresaId = req.user?.empresa?.id;
    if (!empresaId) {
      return res.status(400).json({ message: 'No se encontró el ID de la empresa en el token' });
    }

    const product = await Product.findOneAndUpdate(
      { _id, empresa: empresaId },
      { active: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado para esta empresa' });
    }

    res.json({ message: 'Producto desactivado correctamente', product });
  } catch (error) {
    console.error('Error al desactivar el producto:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

//=================== LISTAR PRODUCTOS ACTIVOS =========================//
exports.getActiveProducts = async (req, res) => {
  try {
    const empresaId = req.user?.empresa?.id;
    if (!empresaId) {
      return res.status(400).json({ message: 'No se encontró el ID de la empresa en el token' });
    }

    const products = await Product.find({ active: true, empresa: empresaId });
    res.status(200).json({ productos: products });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

//=================== LISTAR TODOS LOS PRODUCTOS (ACTIVOS E INACTIVOS) =========================//
exports.listProducts = async (req, res) => {
  try {
    const empresaId = req.user?.empresa?.id;
    if (!empresaId) {
      return res.status(400).json({ message: 'No se encontró el ID de la empresa en el token' });
    }

    const products = await Product.find({ empresa: empresaId });
    res.status(200).json({ productos: products });
  } catch (error) {
    res.status(500).json({ message: 'Error al listar productos', error });
  }
};
