const Empresa = require('../models/Empresa');

const crearEmpresasPrueba = async (req, res) => {
  try {
    const empresas = [
      { nombre: 'MyBusiness', direccion: 'Av. Principal 123', email: 'contacto@mybusiness.com', telefono: '123456789' },
      { nombre: 'SaladasTech', direccion: 'Calle Falsa 456', email: 'info@saladas.tech', telefono: '987654321' },
      { nombre: 'MuniSaladas', direccion: 'Municipalidad 1', email: 'info@munisaladas.gov', telefono: '3794000000' }
    ];

    const inserted = await Empresa.insertMany(empresas);
    res.status(201).json({
      status: 'success',
      message: 'Empresas de prueba creadas',
      empresas: inserted
    });
  } catch (error) {
    console.error('Error al crear empresas:', error);
    res.status(500).json({ status: 'error', message: 'Error al crear empresas', error });
  }
};

module.exports = {
  crearEmpresasPrueba
};
