# Ferrum - Sistema de Cotizaciones

**Ferrum** es una aplicación web diseñada para centralizar y profesionalizar el proceso de emisión de cotizaciones.

Este proyecto soluciona el problema de la descentralización de datos (archivos dispersos) mediante una base de datos en la nube que garantiza folios únicos, respaldo automático y acceso simultáneo.

## Características Principales

* **Folio Automático:** Gestión centralizada de numeración correlativa (evita duplicidad de cotizaciones).
* **Base de Datos en la Nube:** Persistencia de datos en tiempo real usando Supabase (PostgreSQL).
* **Generación de Documentos:** Vista de impresión optimizada para generar PDFs profesionales con el formato corporativo.
* **Búsqueda Rápida:** Filtrado por RUT o Nombre de cliente/empresa.

## Stack Tecnológico

* **Frontend:** React + Vite
* **Estilos:** CSS (Diseño responsivo y específico para impresión)
* **Backend:** Supabase (PostgreSQL + API)
* **Iconos:** Lucide React

## Instalaciones de Dependencias

1. **Instalar dependencias**
    ```bash
    npm install
    npm install @supabase/supabase-js
    npm install lucide-react
    npm install jspdf jspdf-autotable
    ```
