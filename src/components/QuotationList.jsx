import { useState } from 'react';
import { Plus, Search, FileText, Loader } from 'lucide-react';
import { useQuotations } from '../hooks/useQuotations';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../styles/quotations.css';

export default function QuotationList({ irAFormulario }) { 
    const { quotations, loading } = useQuotations();
    const [busqueda, setBusqueda] = useState('');

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

    // --- FUNCIÓN MÁGICA PARA CREAR EL PDF ---
    const generarPDF = (cotizacion) => {
        const doc = new jsPDF();
        const datos = cotizacion.datos_json || {};
        const cliente = datos.cliente || {};
        const items = datos.items || [];
        const totales = datos.totales || { neto: 0, iva: 0, total: 0 };

        // 1. ENCABEZADO
        doc.setFontSize(22);
        doc.setTextColor(234, 88, 12); // Color Naranja Ferrum
        doc.text("FERRUM", 14, 20);
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Sistema de Cotizaciones", 14, 26);

        // Folio y Fecha (A la derecha)
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text(`FOLIO: #${cotizacion.numero_cotizacion}`, 160, 20);
        doc.text(`FECHA: ${formatoFecha(cotizacion.created_at)}`, 160, 26);

        // Línea divisoria
        doc.setDrawColor(234, 88, 12);
        doc.setLineWidth(1);
        doc.line(14, 30, 196, 30);

        // 2. DATOS DEL CLIENTE (Caja gris)
        doc.setFillColor(248, 250, 252); // Fondo gris muy suave
        doc.rect(14, 35, 182, 35, 'F'); // Caja rellena
        
        doc.setFontSize(10);
        doc.setTextColor(0);
        // Columna Izquierda
        doc.setFont("helvetica", "bold");
        doc.text("CLIENTE:", 20, 42);
        doc.setFont("helvetica", "normal");
        doc.text(cliente.nombre || "Sin Nombre", 20, 48);
        
        doc.setFont("helvetica", "bold");
        doc.text("RUT:", 20, 56);
        doc.setFont("helvetica", "normal");
        doc.text(cliente.rut || "Sin RUT", 20, 62);

        // Columna Derecha
        doc.setFont("helvetica", "bold");
        doc.text("DIRECCIÓN:", 110, 42);
        doc.setFont("helvetica", "normal");
        doc.text(cliente.direccion || "No registrada", 110, 48);

        doc.setFont("helvetica", "bold");
        doc.text("TELÉFONO:", 110, 56);
        doc.setFont("helvetica", "normal");
        doc.text(cliente.telefono || "No registrado", 110, 62);

        // 3. TABLA DE PRODUCTOS
        autoTable(doc, {
            startY: 75,
            head: [['DESCRIPCIÓN', 'CANT', 'PRECIO UNIT', 'TOTAL']],
            body: items.map(item => [
                item.descripcion,
                item.cantidad,
                formatoDinero(item.precio),
                formatoDinero(item.cantidad * item.precio)
            ]),
            styles: { fontSize: 9 },
            headStyles: { fillColor: [234, 88, 12], textColor: 255 }, // Cabecera Naranja
            columnStyles: {
                0: { cellWidth: 90 }, // Descripción ancha
                1: { halign: 'center' },
                2: { halign: 'right' },
                3: { halign: 'right', fontStyle: 'bold' }
            }
        });

        // 4. TOTALES (Al final de la tabla)
        const finalY = doc.lastAutoTable.finalY + 10;
        
        doc.setFontSize(10);
        doc.text("Neto:", 140, finalY);
        doc.text(formatoDinero(totales.neto), 190, finalY, { align: "right" });
        
        doc.text("IVA (19%):", 140, finalY + 6);
        doc.text(formatoDinero(totales.iva), 190, finalY + 6, { align: "right" });
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(234, 88, 12); // Naranja para el total
        doc.text("TOTAL:", 140, finalY + 14);
        doc.text(formatoDinero(totales.total), 190, finalY + 14, { align: "right" });

        // 5. GUARDAR
        doc.save(`Cotizacion_${cotizacion.numero_cotizacion}.pdf`);
    };

    return ( 
        <div className="quotations-list fade-in">
      
            {/* BARRA DE BÚSQUEDA */}
            <div className="search-bar" style={{ display: 'flex', gap: '50px', marginBottom: '30px', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#ea580c' }} />
                    <input 
                        type="text" 
                        placeholder="Buscar por Cliente o RUT..." 
                        style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
                <button 
                    onClick={irAFormulario} 
                    className="btn-primary" 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', height: 'fit-content', padding: '12px 24px' }}
                >
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
                            <th style={{ width: '10%' }}>Folio</th>
                            <th style={{ width: '15%' }}>Fecha</th>
                            <th style={{ width: '30%' }}>Cliente</th>
                            <th style={{ width: '15%' }}>RUT</th>
                            <th style={{ width: '15%' }}>Total</th>
                            <th style={{ width: '15%', textAlign: 'center' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cotizacionesFiltradas.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                    {busqueda ? 'No se encontraron resultados' : 'No hay cotizaciones aún.'}
                                </td>
                            </tr>
                        ) : (
                            cotizacionesFiltradas.map((q) => (
                                <tr key={q.id}>
                                    <td style={{ fontWeight: 'bold', color: '#ea580c' }}>#{q.numero_cotizacion}</td>
                                    <td>{formatoFecha(q.created_at)}</td>
                                    <td style={{ fontWeight: '600' }}>{q.nombre_cliente}</td>
                                    <td>{q.rut_cliente}</td>
                                    <td style={{ fontWeight: 'bold' }}>
                                        {formatoDinero(q.datos_json?.totales?.total)}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        {/* ✅ AQUÍ CONECTAMOS EL BOTÓN AL GENERADOR DE PDF */}
                                        <button 
                                            onClick={() => generarPDF(q)}
                                            className="btn-secondary" 
                                            style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'inline-flex', gap: '6px', alignItems: 'center' }}
                                        >
                                            <FileText size={16} /> Ver PDF
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