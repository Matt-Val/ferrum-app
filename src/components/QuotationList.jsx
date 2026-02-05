import { useState } from 'react';
import { Plus, Search, FileText, Loader, LogOut, X, Printer, Download } from 'lucide-react';
import { useQuotations } from '../hooks/useQuotations';
import { generarPDF } from '../utils/pdfGenerator';
import '../styles/quotations.css';

export default function QuotationList({ irAFormulario, onLogout }) { 
    const { quotations, loading } = useQuotations();
    const [busqueda, setBusqueda] = useState('');
    const [pdfUrl, setPdfUrl] = useState(null);
    const [cotizacionActual, setCotizacionActual] = useState(null);

    const cotizacionesFiltradas = quotations.filter(q => 
        q.nombre_cliente?.toLowerCase().includes(busqueda.toLowerCase()) ||
        q.rut_cliente?.toLowerCase().includes(busqueda.toLowerCase())
    );

    const formatoFecha = (f) => new Date(f).toLocaleDateString('es-CL');
    const formatoDinero = (m) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP'}).format(m || 0);

    const verPDF = async (cotizacion) => {
        const url = await generarPDF(cotizacion, 'ver');
        if (url) {
            setPdfUrl(url);
            setCotizacionActual(cotizacion);
        }
    };

    return ( 
        <div className="quotations-list fade-in">
            <div style={{ marginBottom: '20px', borderBottom: '2px solid #ea580c', paddingBottom: '10px' }}>
                <h1 style={{ color: '#1e293b', fontSize: '1.5rem', margin: 0 }}>FERRUM - Gestión de Cotizaciones</h1>
            </div>
      
            <div className="search-bar" style={{ display: 'flex', gap: '40px', marginBottom: '30px', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1, marginRight: '40px'}}>
                    <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#ea580c' }} />
                    <input 
                        type="text" 
                        placeholder="Buscar cliente..." 
                        style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={irAFormulario} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', padding: '12px 24px' }}>
                        <Plus size={20} /> Nueva
                    </button>
                    {/* Botón Salir Local */}
                    <button onClick={onLogout} className="btn-secondary" title="Salir" style={{ padding: '12px', borderColor: '#ef4444', color: '#ef4444' }}>
                        <LogOut size={20} />
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#ea580c' }}><Loader className="animate-spin" /> Cargando...</div>
            ) : (
                <div className="table-responsive">
                    <table className="quotations-table">
                        <thead>
                            <tr>
                                <th style={{ width: '10%' }}>Folio</th>
                                <th style={{ width: '15%' }}>Fecha</th>
                                <th style={{ width: '30%' }}>Cliente</th>
                                <th style={{ width: '15%' }}>RUT</th>
                                <th style={{ width: '15%' }}>Total</th>
                                <th style={{ width: '15%', textAlign: 'center' }}>PDF</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cotizacionesFiltradas.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Sin cotizaciones.</td></tr>
                            ) : (
                                cotizacionesFiltradas.map((q) => (
                                    <tr key={q.id}>
                                        <td style={{ fontWeight: 'bold', color: '#ea580c' }}>#{q.numero_cotizacion}</td>
                                        <td>{formatoFecha(q.created_at)}</td>
                                        <td style={{ fontWeight: '600' }}>{q.nombre_cliente}</td>
                                        <td>{q.rut_cliente}</td>
                                        <td style={{ fontWeight: 'bold' }}>{formatoDinero(q.datos_json?.totales?.total)}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <button onClick={() => verPDF(q)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                                                <FileText size={16} /> Ver
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {pdfUrl && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', width: '90%', maxWidth: '800px', padding: '15px', borderRadius: '8px 8px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, color: '#333' }}>Vista Previa</h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => generarPDF(cotizacionActual, 'imprimir')} className="btn-secondary" style={{ display: 'flex', gap: '5px' }}> <Printer size={18} /> </button>
                            <button onClick={() => generarPDF(cotizacionActual, 'descargar')} className="btn-primary" style={{ display: 'flex', gap: '5px' }}> <Download size={18} /> </button>
                            <button onClick={() => setPdfUrl(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}> <X size={24} /> </button>
                        </div>
                    </div>
                    <iframe src={pdfUrl} style={{ width: '90%', maxWidth: '800px', height: '80vh', background: 'white', border: 'none', borderRadius: '0 0 8px 8px' }} />
                </div>
            )}
        </div>
    );
}