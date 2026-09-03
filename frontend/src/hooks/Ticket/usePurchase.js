import { useState, useCallback } from 'react';

export const usePurchase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const executePurchase = useCallback(async (purchaseData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    const baseUrl = import.meta.env.VITE_API_URL; // 
    const endpoint = '/tickets/purchase'; 
    
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(purchaseData),
      });

      // Si el server responde con 404 o 500, response.ok será false
      if (!response.ok) {
        // Intentamos leer el error del JSON, si falla leemos el texto (por si es HTML)
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
      } else {
        throw new Error(data.error || 'No se pudo procesar la compra');
      }

    } catch (err) {
      console.error("Falla en la operación:", err.message);
      setError(err.message);
      // Para la presentación, si querés forzar el éxito aunque el backend falle:
      // setSuccess(true); 
    } finally {
      setLoading(false);
    }
  }, []);

  const resetStatus = useCallback(() => {
    setSuccess(false);
    setError(null);
    setLoading(false);
  }, []);

  return { executePurchase, loading, error, success, resetStatus };
};