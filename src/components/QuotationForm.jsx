import { useState } from 'react';
import { Save, Printer, ArrowLeft } from 'lucide-react';
import ItemsTable from './ItemsTable';
import { useQuotations } from '../hooks/useQuotations';
import '../styles/quotations.css';
import { FetchableDevEnvironment } from 'vite';


export default function QuotationForm({ alVolver }) { 
    const { addQuotation, loading } = useQuotations();

    // Datos del cliente.
    const [cliente, setCliente] = useState({ 
        rut: '',
        nombre: '',
        direccion: '',
        ciudad: '',
        telefono: '',
        email: ''
    });

    // Lista de productos (empieza con uno vacío).
    const [items, setItems] = useState([
        { id: crypto.randomUUID(), descripcion: '', cantidad: 1, precio: 0 }
    ]);

    // Calculos automáticos (se actualizan solos).
    const neto = items.reduce((acc, item) => acc + (item.cantidad * item.precio), 0);
    const iva = Math.round(neto * 0.19);
    const total = neto + iva;

    // Formatear a la moneda visualmente.
    const formatoDinero = (monto) => { 
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP'}).format(monto);
    };

    // Guardado en SupaBase.
    const guardar = async () => { 
        if (!cliente.nombre) return alert("Por favor, escriba el nombre del cliente.");
        if (neto === 0) return alert("La cotización está vacía. (Total $0).")
        
            const guardado = await addQuotation(cliente, items, {neto, iva, total});

            if (guardado) { 
                alert("Cotización guardada correctamente.");
                alVolver();
            } else { 
                alert("Error al guardar la cotización.")
            }
    };

    return ( 
        <div className="quotation-form fade-in">

            <div className="excel-header">
                <h2>Ferrum</h2>
                <p style={{ color: '#666', fontSize: '0.9rem', margin: '5px 0'}}>Sistema de Emisión de Cotizaciones</p>

            </div>

            <div className="excel-grid">
                <div className="form-group">
                    <label>RUT Cliente:</label>
                    <input
                        type="text"
                        placeholder="EJ: 76.123.456-7"
                        value={cliente.rut}
                        onChange={e => setCliente({ ...cliente, rut: e.target.value })}
                    />
                </div>

                <div className="form-group" style={{ marginTop: '15px'}}>
                    <label>Razón Social / Nombre:</label>
                    <input
                        type="text"
                        placeholder="Nombre del cliente..."
                        style= {{ fontWeight: 'bold' }}
                        value={cliente.nombre}
                        onChange={e => setCliente({...cliente, nombre: e.target.value})}
                    />
                </div>

                <div className="form-group" style={{ marginTop: '15px'}}>
                    <label>Email:</label>
                    <input type="email" value={cliente.email} onChange={e => setCliente({...cliente, email: e.target.value})} />
                </div>
            </div>

            <div>
                <div className="form-group" style={{ marginTop: '15px'}}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={cliente.email}
                        onChange={e => setCliente({...cliente, email: e.target.value})}
                    />
                </div>
            </div>


            <div>
                <div className="form-group">
                    <label>Dirección:</label>
                    <input
                        type="text"
                        value={cliente.direccion}
                        onChange={e => setCliente({...cliente, direccion: e.target.value})}
                    />
                </div>

                <div className="form-group" style={{ marginTop: '15px'}}>
                    <label>Ciudad/Comuna:</label>
                    <input 
                        type="text" 
                        value={cliente.ciudad}
                        onChange={e => setCliente({...cliente, ciudad: e.target.value})}                  
                    />
                </div>

                <div className="form-group" style={{ marginTop: '15px'}}>
                    <label>Teléfono:</label>
                    <input 
                        type="text"
                        value={cliente.telefono}
                        onChange={e => setCliente({...cliente, telefono: e.target.value})} 
                    />
                </div>
            </div>

            <ItemsTable items={items} setItems={setItems}/>

            <div className="totals-section">
                <div className="totals-box">
                    <div className="totals-row">
                        <span>Neto:</span>
                        <span>{formatoDinero(neto)}</span>
                    </div>
                    <div className="totals-row">
                        <span>IVA(19%)</span>
                        <span>{formatoDinero(iva)}</span>
                    </div>
                    <div className="totals-row final">
                        <span>TOTAL:</span>
                        <span>{formatoDinero(total)}</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                <button 
                    onClick={alVolver}
                    className="btn-secondary"
                    style={{display: 'flex', alignItems: 'center', gap: '5px'}}
                >
                    <ArrowLeft size={18} /> Volver
                </button>

                <div style={{ display: 'flex', gap: '10px'}}>
                    <button
                        onClick={guardar}
                        disabled={loading}
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: loading ? 0.7 : 1}}
                    >
                        <Save size={18} /> {loading ? 'Guardando...' : 'Guardar Cotización'}
                    </button>
                </div>
            </div>
        </div>
    );
};