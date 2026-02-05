# Ferrum - Sistema de Gestión de Cotizaciones

**Ferrum** es una aplicación web diseñada para la emisión rápida, profesional y centralizada de cotizaciones.

Esta versión ha sido optimizada para funcionar de manera 100% local (offline), eliminando la dependencia de servidores externos o conexión a internet para gestionar tus datos. Todo queda guardado en el navegador.

## Características Principales

* **Folio Automático:** El sistema detecta la última cotización y genera el siguiente número correlativo automáticamente.
* **Generación de PDF:** Crea documentos PDF con la marca *FERRUM*, listos para imprimir o descargar, con un diseño limpio y corporativo.
* **Cálculos Automáticos:** El sistema calcula netos, IVA (19?%) y totales al instante, permitiendo el uso de decimales.
* **Búsqueda Rápida:** Encuentra cotizaciones antiguas filtrando por nombre de cliente o RUT.

## Stack Tecnológico

* **Frontend:** React + Vite
* **Persistencia:** LocalStorage
* **Estilos:** CSS (Diseño responsivo y específico para impresión)
* **Generación PDF:** jsPDF + jspdf-autotable
* **Iconos:** Lucide React

## Instalaciones de Dependencias

1. **Instalar dependencias**
    ```bash
    npm install
    npm install lucide-react
    npm install jspdf jspdf-autotable
    ```
