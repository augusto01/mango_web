import { useState } from 'react';
import axios from 'axios';

export const useUsers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Traemos la URL directamente del .env de Vite
  const BASE_URL = import.meta.env.VITE_API_URL;

  // Función para obtener el token del momento
  const getHeaders = () => ({
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  });

  // --- PETICIÓN: CREAR ---
  const createUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${BASE_URL}/users/register`, userData, getHeaders());
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || "ERROR_AL_CREAR_USUARIO";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // --- PETICIÓN: MODIFICAR ---
  const updateUser = async (id, userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${BASE_URL}/users/update/${id}`, userData, getHeaders());
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || "ERROR_AL_ACTUALIZAR";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // --- PETICIÓN: ELIMINAR LÓGICO ---
  const deleteUser = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`${BASE_URL}/users/delete/${id}`, getHeaders());
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || "ERROR_AL_ELIMINAR";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { createUser, updateUser, deleteUser, loading, error };
};