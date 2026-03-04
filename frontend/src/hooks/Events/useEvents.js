import { useState, useCallback } from 'react';
import axios from 'axios'; // O tu instancia de axios configurada
import { useAuth } from '../../../context/authProvider';

export const useEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    // Configuración de cabeceras con el token
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    // 1. OBTENER TODOS LOS EVENTOS
    const getEvents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/events', config);
            // Ordenar por fecha por defecto (más próximos primero)
            const sortedEvents = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
            setEvents(sortedEvents);
        } catch (err) {
            setError(err.response?.data?.message || 'ERROR_FETCHING_EVENTS');
        } finally {
            setLoading(false);
        }
    }, [token]);

    // 2. CREAR NUEVO EVENTO
    const createEvent = async (eventData) => {
        setLoading(true);
        setError(null);
        try {
            // Aquí podrías procesar la data antes de enviarla
            // Por ejemplo, calcular el stock total sumando categorías
            const totalStock = eventData.categories.reduce((acc, cat) => {
                return acc + (cat.useLotes 
                    ? cat.lotes.reduce((sum, lote) => sum + Number(lote.quantity), 0)
                    : Number(cat.stock));
            }, 0);

            const payload = { ...eventData, totalStock };
            const response = await axios.post('/api/events', payload, config);
            
            setEvents(prev => [...prev, response.data]);
            return response.data;
        } catch (err) {
            const msg = err.response?.data?.message || 'ERROR_CREATING_EVENT';
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    // 3. ACTUALIZAR EVENTO
    const updateEvent = async (id, eventData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put(`/api/events/${id}`, eventData, config);
            setEvents(prev => prev.map(ev => ev._id === id ? response.data : ev));
            return response.data;
        } catch (err) {
            const msg = err.response?.data?.message || 'ERROR_UPDATING_EVENT';
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    // 4. ELIMINAR EVENTO (Baja lógica o física)
    const deleteEvent = async (id) => {
        if (!window.confirm("CONFIRM_ACTION: ¿ELIMINAR EVENTO PERMANENTEMENTE?")) return;
        
        setLoading(true);
        try {
            await axios.delete(`/api/events/${id}`, config);
            setEvents(prev => prev.filter(ev => ev._id !== id));
        } catch (err) {
            setError(err.response?.data?.message || 'ERROR_DELETING_EVENT');
        } finally {
            setLoading(false);
        }
    };

    return {
        events,
        loading,
        error,
        getEvents,
        createEvent,
        updateEvent,
        deleteEvent,
        setError
    };
};