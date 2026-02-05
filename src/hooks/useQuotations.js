import { useState, useEffect } from 'react';

export const useQuotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. CARGAR DATOS (Desde El Navegador)
  const fetchQuotations = () => {
    setLoading(true);
    const savedData = localStorage.getItem('ferrum_cotizaciones');
    if (savedData) {
        setQuotations(JSON.parse(savedData));
    } else {
        setQuotations([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  // 2. GUARDAR DATOS
  const addQuotation = async (cliente, items, totales) => {
    // Simulamos una pequeña espera para darle el toque de profesionalismo
    await new Promise(resolve => setTimeout(resolve, 500));

    // Leemos lo que hay guardado
    const currentData = JSON.parse(localStorage.getItem('ferrum_cotizaciones') || '[]');
    
    // Calculamos el siguiente Folio (Si el último fue 10, este será 11)
    // Autoincremental simple basado en el último guardado
    const nextId = currentData.length > 0 ? parseInt(currentData[0].numero_cotizacion) + 1 : 1;

    const nuevaCotizacion = {
      id: Date.now(), // ID único interno
      numero_cotizacion: nextId,
      created_at: new Date().toISOString(),
      rut_cliente: cliente.rut,
      nombre_cliente: cliente.nombre,
      datos_json: { cliente, items, totales }
    };

    // Guardamos la nueva lista
    const newData = [nuevaCotizacion, ...currentData];
    localStorage.setItem('ferrum_cotizaciones', JSON.stringify(newData));
    
    // Actualizamos la vista
    setQuotations(newData);
    return true;
  };

  return { quotations, loading, addQuotation };
};