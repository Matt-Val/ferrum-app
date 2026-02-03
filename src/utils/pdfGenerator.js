import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generarPDF = (cotizacion, accion = 'descargar') => {
    const doc = new jsPDF();
    const datos = cotizacion.datos_json || {};
    const cliente = datos.cliente || {};
    const items = datos.items || [];
    const totales = datos.totales || { neto: 0, iva: 0, total: 0 };

    const formatoFecha = (fecha) => new Date(fecha).toLocaleDateString('es-CL');
    const formatoDinero = (monto) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(monto || 0);

    // --- 1. ENCABEZADO ---
    doc.setFontSize(22);
    doc.setTextColor(234, 88, 12);
    doc.text("FPC Abastecimiento", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Soluciones Industriales y Servicios", 14, 26);

    // Datos a la derecha
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`FOLIO: #${cotizacion.numero_cotizacion || 'BORRADOR'}`, 196, 20, { align: 'right' });
    doc.text(`FECHA: ${formatoFecha(cotizacion.created_at || new Date())}`, 196, 26, { align: 'right' });

    // Línea divisoria
    doc.setDrawColor(234, 88, 12); 
    doc.setLineWidth(1); 
    doc.line(14, 32, 196, 32);

    // --- TÍTULO DEL DOCUMENTO ---
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("HOJA DE COTIZACIÓN", 105, 42, { align: 'center' }); // Centrado

    // --- 2. DATOS DEL CLIENTE  ---
    const startYClient = 48;
    
    doc.setFillColor(248, 250, 252); 
    doc.rect(14, startYClient, 182, 35, 'F');
    
    doc.setFontSize(10); 
    doc.setTextColor(0);
    // Columna Izq
    doc.setFont("helvetica", "bold"); doc.text("CLIENTE:", 20, startYClient + 7);
    doc.setFont("helvetica", "normal"); doc.text(cliente.nombre || "Sin Nombre", 20, startYClient + 13);
    doc.setFont("helvetica", "bold"); doc.text("RUT:", 20, startYClient + 21);
    doc.setFont("helvetica", "normal"); doc.text(cliente.rut || "Sin RUT", 20, startYClient + 27);
    // Columna Der
    doc.setFont("helvetica", "bold"); doc.text("DIRECCIÓN:", 110, startYClient + 7);
    doc.setFont("helvetica", "normal"); doc.text(cliente.direccion || "No registrada", 110, startYClient + 13);
    doc.setFont("helvetica", "bold"); doc.text("TELÉFONO:", 110, startYClient + 21);
    doc.setFont("helvetica", "normal"); doc.text(cliente.telefono || "No registrado", 110, startYClient + 27);

    // --- 3. TABLA DE PRODUCTOS ---
    autoTable(doc, {
        startY: 90, // Bajamos la tabla para que no choque
        head: [['DESCRIPCIÓN', 'CANT', 'PRECIO UNIT', 'TOTAL']],
        body: items.map(item => [
            item.descripcion,
            item.cantidad,
            formatoDinero(item.precio),
            formatoDinero(item.cantidad * item.precio)
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [234, 88, 12], textColor: 255 },
        columnStyles: { 
            0: { cellWidth: 90 }, 
            1: { halign: 'center' }, 
            2: { halign: 'right' }, 
            3: { halign: 'right', fontStyle: 'bold' } 
        }
    });

    // --- 4. TOTALES (CUADRÍCULA) ---
    const finalY = doc.lastAutoTable.finalY + 10;

    autoTable(doc, {
        startY: finalY,
        body: [
            ['Neto', formatoDinero(totales.neto)],
            ['IVA (19%)', formatoDinero(totales.iva)],
            ['TOTAL', formatoDinero(totales.total)]
        ],
        theme: 'grid',
        styles: { 
            fontSize: 10,
            cellPadding: 2,
            lineColor: [254, 215, 170],
            lineWidth: 0.1
        },
        columnStyles: {
            0: { fillColor: [255, 247, 237], textColor: [154, 52, 18], fontStyle: 'bold', cellWidth: 40 },
            1: { halign: 'right', textColor: [51, 65, 85], cellWidth: 40 }
        },
        didParseCell: function (data) {
            if (data.row.index === 2) {
                data.cell.styles.fillColor = [234, 88, 12];
                data.cell.styles.textColor = [255, 255, 255];
                data.cell.styles.fontStyle = 'bold';
                data.cell.styles.fontSize = 12;
            }
        },
        margin: { left: 116 } 
    });

    // --- 5. SALIDA ---
    if (accion === 'descargar') {
        doc.save(`Cotizacion_FPC_${cotizacion.numero_cotizacion || 'Nueva'}.pdf`);
    } else if (accion === 'ver') {
        return doc.output('bloburl'); 
    } else if (accion === 'imprimir') {
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
    }
};