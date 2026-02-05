import { useState } from 'react';
import { Save, ArrowLeft, CheckCircle, Printer, Download } from 'lucide-react';
import ItemsTable from './ItemsTable';
import { useQuotations } from '../hooks/useQuotations';
import { generarPDF } from '../utils/pdfGenerator';
import '../styles/quotations.css';

export default function QuotationForm({ alVolver }) { 
    const { addQuotation, loading } = useQuotations();
    const [cotizacionGuardada, setCotizacionGuardada] = useState(null);

    const [cliente, setCliente] = useState({ 
        rut: '', nombre: '', direccion: '', ciudad: '', telefono: '', email: ''
    });

    const [items, setItems] = useState([
    { id: Date.now(), descripcion: '', cantidad: 1, precio: 0 }
    ]);

    // Cálculo seguro de totales
    const neto = items.reduce((acc, item) => {
        // Convertimos a float asegurando que si viene texto vacío o inválido sea 0
        const cant = parseFloat(item.cantidad) || 0;
        const prec = parseFloat(item.precio) || 0;
        return acc + (cant * prec);
    }, 0);
    
    const iva = Math.round(neto * 0.19);
    const total = neto + iva;


    const formatoDinero = (m) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP'}).format(m);

    const guardar = async () => { 
        if (!cliente.nombre) return alert("Por favor, escriba el nombre del cliente.");
        if (neto === 0) return alert("La cotización está vacía.");
        
        const nuevaData = { cliente, items, totales: { neto, iva, total } };
        const guardado = await addQuotation(cliente, items, { neto, iva, total });

        if (guardado) { 
            setCotizacionGuardada({ 
                numero_cotizacion: "NUEVA",
                created_at: new Date(),
                datos_json: nuevaData 
            });
        } else { 
            alert("Error al guardar.");
        }
    };

    if (cotizacionGuardada) {
        return (
            <div className="quotation-form fade-in" style={{ textAlign: 'center', padding: '60px 20px' }}>
                <CheckCircle size={80} color="#22c55e" style={{ marginBottom: '20px' }} />
                <h2 style={{ color: '#1e293b', fontSize: '2rem', marginBottom: '10px' }}>¡Cotización Guardada!</h2>
                <p style={{ color: '#64748b', marginBottom: '40px' }}>El documento se ha generado correctamente.</p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <button onClick={() => generarPDF(cotizacionGuardada, 'imprimir')} className="btn-secondary" style={{ padding: '15px 30px', fontSize: '1.1rem', display: 'flex', gap: '10px' }}>
                        <Printer /> Imprimir
                    </button>
                    <button onClick={() => generarPDF(cotizacionGuardada, 'descargar')} className="btn-primary" style={{ padding: '15px 30px', fontSize: '1.1rem', display: 'flex', gap: '10px' }}>
                        <Download /> Descargar PDF
                    </button>
                </div>

                <button onClick={alVolver} style={{ marginTop: '40px', background: 'none', border: 'none', color: '#64748b', textDecoration: 'underline', cursor: 'pointer' }}>
                    Volver al listado de cotizaciones
                </button>
            </div>
        );
    }

    return ( 
        <div className="quotation-form fade-in">
            <div className="excel-header">
                <h2>Nueva Cotización</h2>
                <p style={{ color: '#666', fontSize: '0.9rem', margin: '5px 0'}}>Ingrese los datos del cliente y productos</p>
            </div>

            <div className="excel-grid">
                <div className="col-left">
                    <div className="form-group"><label>RUT Cliente:</label><input type="text" placeholder="EJ: 76.123.456-7" value={cliente.rut} onChange={e => setCliente({ ...cliente, rut: e.target.value })} /></div>
                    <div className="form-group"><label>Razón Social / Nombre:</label><input type="text" placeholder="Nombre del cliente..." style={{ fontWeight: 'bold' }} value={cliente.nombre} onChange={e => setCliente({...cliente, nombre: e.target.value})} /></div>
                    <div className="form-group"><label>Email Contacto:</label><input type="email" placeholder="cliente@empresa.com" value={cliente.email} onChange={e => setCliente({...cliente, email: e.target.value})} /></div>
                </div>
                <div className="col-right">
                    <div className="form-group"><label>Dirección:</label><input type="text" placeholder="Calle, Número..." value={cliente.direccion} onChange={e => setCliente({...cliente, direccion: e.target.value})} /></div>
                    <div className="form-group"><label>Ciudad / Comuna:</label><input type="text" placeholder="Ej: Santiago" value={cliente.ciudad} onChange={e => setCliente({...cliente, ciudad: e.target.value})} /></div>
                    <div className="form-group"><label>Teléfono:</label><input type="text" placeholder="+56 9..." value={cliente.telefono} onChange={e => setCliente({...cliente, telefono: e.target.value})} /></div>
                </div>
            </div>

            <ItemsTable items={items} setItems={setItems}/>

            {/* --- AQUÍ ESTÁ EL CAMBIO DE LA CUADRÍCULA --- */}
            <div className="totals-section">
                <div className="totals-grid">
                    {/* Fila Neto */}
                    <div className="total-label">Neto</div>
                    <div className="total-value">{formatoDinero(neto)}</div>

                    {/* Fila IVA */}
                    <div className="total-label">IVA (19%)</div>
                    <div className="total-value">{formatoDinero(iva)}</div>

                    {/* Fila Total (Naranja fuerte) */}
                    <div className="total-label final">TOTAL</div>
                    <div className="total-value final">{formatoDinero(total)}</div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                <button onClick={alVolver} className="btn-secondary" style={{display: 'flex', alignItems: 'center', gap: '5px'}}><ArrowLeft size={18} /> Volver</button>
                <button onClick={guardar} disabled={loading} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: loading ? 0.7 : 1}}><Save size={18} /> {loading ? 'Guardando...' : 'Guardar Cotización'}</button>
            </div>
        </div>
    );
};