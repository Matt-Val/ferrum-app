import { use, useState } from 'react';
import { Plus, Search, FileText, Loader } from 'lucide-react';
import { useQuotations } from '../hooks/useQuotations';
import '../styles/quotations.css';

export default function QuotationList({ irAFormulario}) { 
    const { quotations, loading } = useQuotations();

    const [busqueda, setBusqueda] = useState('');

    // Filtramos la lista según lo que se escriba en el buscador.
    const cotizacionesFiltradas = quotations.filter(q => 
        q.nombre_cliente?.toLowerCase().includes(busqueda.toLowerCase()) ||
        q.rut_cliente?.toLowerCase().includes(busqueda.toLowerCase())
    );

    const formatoFecha = (fecha) => { 
        if (!fecha) return '-';
        return new Date(fecha).toLocaleDateString('es-CL');
    };

    const formatoDinero = (monto) => { 
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP'}).format(monto || 0);
    };

    return ( 
        <div className="quotations-list fade-in">
      
      {/* CABECERA Y BUSCADOR */}
      <div className="search-bar">
        <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: '#ea580c' }} />
            <input 
                type="text" 
                placeholder="Buscar por Cliente o RUT..." 
                style={{ paddingLeft: '35px' }}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            />
        </div>
        <button onClick={irAFormulario} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={20} /> Nueva Cotización
        </button>
      </div>

      {/* TABLA DE RESULTADOS */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#ea580c' }}>
            <Loader className="animate-spin" /> Cargando cotizaciones...
        </div>
      ) : (
        <table className="quotations-table">
            <thead>
                <tr>
                    <th>Folio</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>RUT</th>
                    <th>Total</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {cotizacionesFiltradas.length === 0 ? (
                    <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
                            {busqueda ? 'No se encontraron resultados' : 'No hay cotizaciones aún. ¡Crea la primera!'}
                        </td>
                    </tr>
                ) : (
                    cotizacionesFiltradas.map((q) => (
                        <tr key={q.id}>
                            <td style={{ fontWeight: 'bold', color: '#ea580c' }}>#{q.numero_cotizacion}</td>
                            <td>{formatoFecha(q.created_at)}</td>
                            <td>{q.nombre_cliente}</td>
                            <td>{q.rut_cliente}</td>
                            <td style={{ fontWeight: 'bold' }}>
                                {formatoDinero(q.datos_json?.totales?.total)}
                            </td>
                            <td>
                                <button className="btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem', display: 'flex', gap: '5px' }}>
                                    <FileText size={14} /> Ver PDF
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    )}
    </div>
  );
}