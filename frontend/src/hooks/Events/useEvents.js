import { useState, useCallback } from 'react';
import axios from 'axios';

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_URL;

  const getHeaders = () => ({
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  });

  // --- OBTENER TODOS: /events/all ---
  // Usamos useCallback para que la referencia de la función sea estable y no dispare useEffect infinitamente
  const getEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/events/all`, getHeaders());
      // Ajuste para leer response.data o response.data.events
      const data = Array.isArray(response.data) ? response.data : response.data.events || [];
      setEvents(data);
    } catch (err) {
      const msg = err.response?.data?.message || "ERROR_FETCHING_EVENTS_INFRASTRUCTURE";
      setError(msg);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [BASE_URL]);

  // --- CREAR: /events/register ---
  const createEvent = async (eventData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${BASE_URL}/events/register`, eventData, getHeaders());
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || "ERROR_REGISTERING_EVENT";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // --- ACTUALIZAR: /events/update/:id ---
  const updateEvent = async (id, eventData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${BASE_URL}/events/update/${id}`, eventData, getHeaders());
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || "ERROR_UPDATING_EVENT_DATA";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // --- ELIMINAR: /events/delete/:id ---
  const deleteEvent = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`${BASE_URL}/events/delete/${id}`, getHeaders());
      // Opcional: recargar la lista después de eliminar
      await getEvents();
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || "ERROR_DELETING_EVENT";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { events, getEvents, createEvent, updateEvent, deleteEvent, loading, error, setError };
};