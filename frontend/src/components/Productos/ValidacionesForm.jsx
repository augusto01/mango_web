import React from 'react';

const ValidacionesForm = ({ formData, requiredFields }) => {
  const errors = {};

  requiredFields.forEach(field => {
    if (!formData[field] || formData[field].toString().trim() === '') {
      errors[field] = 'Este campo es obligatorio';
    }
  });

  const hayErrores = Object.keys(errors).length > 0;

  return { errors, hayErrores };
};

export default ValidacionesForm;
