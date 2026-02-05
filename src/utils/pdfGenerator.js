import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Cargador de logo
const cargarLogo = (url) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
    });
};

export const generarPDF = async (cotizacion, accion = 'ver') => {
    // Truco anti-bloqueo para imprimir
    let ventanaImpresion = null;
    if (accion === 'imprimir') {
        ventanaImpresion = window.open('', '_blank');
        if (ventanaImpresion) {
            ventanaImpresion.document.write('<html><head><title>Imprimiendo...</title></head><body style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;"><h2>Generando documento Ferrum...</h2></body></html>');
        } else {
            alert("Por favor habilita las ventanas emergentes.");
            return;
        }
    }

    let doc;
    try { doc = new jsPDF(); } catch (e) { return; }

    const colorMarca = [234, 88, 12];
    
    const logo = await cargarLogo('/Logo-Ferrum.png'); 

    // --- ENCABEZADO FERRUM ---
    if (logo) {
        try { doc.addImage(logo, 'PNG', 14, 15, 30, 30); } catch (e) {}
    }

    const textoX = logo ? 50 : 14;
    
    doc.setFontSize(16);
    doc.setTextColor(...colorMarca);
    doc.setFont("helvetica", "bold");
    doc.text("Ferrum", textoX, 25);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text("Cotizaciones y Servicios", textoX, 32);
    doc.text("contacto@ferrum.cl", textoX, 37); 

    // --- FOLIO ---
    const folioTexto = cotizacion.numero_cotizacion ? `#${cotizacion.numero_cotizacion}` : "BORRADOR";
    const fechaTexto = new Date(cotizacion.created_at || new Date()).toLocaleDateString('es-CL');

    doc.setFontSize(10);
    doc.text(`FOLIO:`, 150, 25);
    doc.text(`FECHA:`, 150, 32);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colorMarca);
    doc.text(folioTexto, 170, 25);
    doc.setTextColor(0,0,0);
    doc.text(fechaTexto, 170, 32);

    doc.setDrawColor(...colorMarca);
    doc.setLineWidth(0.5);
    doc.line(14, 50, 196, 50);

    // --- DATOS CLIENTE ---
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("DATOS DEL CLIENTE:", 14, 65);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Señor(es):", 14, 72);
    doc.text(cotizacion.nombre_cliente || "---", 35, 72);
    doc.text("Dirección:", 110, 72);
    doc.text(cotizacion.direccion_cliente || "---", 130, 72);
    doc.text("RUT:", 14, 78);
    doc.text(cotizacion.rut_cliente || "---", 35, 78);
    doc.text("Fono:", 110, 78);
    doc.text(cotizacion.telefono_cliente || "---", 130, 78);

    // --- TABLA ---
    const items = cotizacion.datos_json?.items || [];
    const tableColumn = ["Descripción", "Cant", "P. Unitario", "Total"];
    const tableRows = items.map(item => [
        item.descripcion,
        item.cantidad,
        `$${parseInt(item.precio || 0).toLocaleString('es-CL')}`,
        `$${parseInt((item.precio || 0) * (item.cantidad || 0)).toLocaleString('es-CL')}`
    ]);

    autoTable(doc, {
        startY: 90,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: colorMarca, textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: { 0: { cellWidth: 90 }, 1: { halign: 'center' }, 2: { halign: 'right' }, 3: { halign: 'right', fontStyle: 'bold' } }
    });

    // --- TOTALES ---
    const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY + 30 : 160;
    const totales = cotizacion.datos_json?.totales || { neto: 0, iva: 0, total: 0 };

    doc.setFontSize(10);
    doc.text("Neto:", 140, finalY);
    doc.text(`$${parseInt(totales.neto || 0).toLocaleString('es-CL')}`, 195, finalY, { align: 'right' });
    doc.text("IVA (19%):", 140, finalY + 6);
    doc.text(`$${parseInt(totales.iva || 0).toLocaleString('es-CL')}`, 195, finalY + 6, { align: 'right' });

    doc.setFillColor(...colorMarca);
    doc.rect(138, finalY + 10, 60, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL:", 140, finalY + 15.5);
    doc.text(`$${parseInt(totales.total || 0).toLocaleString('es-CL')}`, 195, finalY + 15.5, { align: 'right' });

    // --- PIE DE PÁGINA FERRUM ---
    doc.setTextColor(...colorMarca);
    doc.setFontSize(10);
    doc.text("Gracias por preferir a FERRUM", 14, finalY);
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("Documento generado electrónicamente.", 14, finalY + 6);

    // Salida
    if (accion === 'descargar') doc.save(`Cotizacion_${cotizacion.numero_cotizacion}.pdf`);
    else if (accion === 'imprimir') {
        doc.autoPrint();
        const blob = doc.output('bloburl');
        if (ventanaImpresion) ventanaImpresion.location.href = blob;
    } else return doc.output('bloburl');
};