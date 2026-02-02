import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useQuotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. CARGAR DATOS
  const fetchQuotations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('cotizaciones')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error cargando:', error);
    else setQuotations(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  // 2. GUARDAR DATOS
  const addQuotation = async (cliente, items, totales) => {
    const nuevaCotizacion = {
      rut_cliente: cliente.rut,
      nombre_cliente: cliente.nombre,
      datos_json: { cliente, items, totales }
    };

    const { data, error } = await supabase
      .from('cotizaciones')
      .insert([nuevaCotizacion])
      .select();

    if (error) {
      console.error('Error guardando:', error);
      return false;
    } else {
      setQuotations([data[0], ...quotations]);
      return true;
    }
  };

  return { quotations, loading, addQuotation };
};