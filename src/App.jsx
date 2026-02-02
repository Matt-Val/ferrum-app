import { useState } from 'react'
import QuotationList from './components/QuotationList'
import QuotationForm from './components/QuotationForm'

function App() {
  const [vista, setVista] = useState('lista'); // 'lista' o 'formulario'

  return ( 
    <div className="container">
      {vista === 'lista' && ( 
        <header style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h1 style={{ color: '#ea580c', fontSize: '2.5rem', marginBottom: '5px', textTransform: 'uppercase'}}>
            Ferrum - Sistema de Emisión de Cotizaciones
          </h1>
          <p style={{ color: '#64748b'}}>Sistema de Gestión FPC Abastecimiento</p>
        </header>
      )}

      <main>
        {vista === 'lista' ? ( 
          <QuotationList irAFormulario={() => setVista('formulario')} />
        ) : ( 
          <QuotationForm alVolver={() => setVista('lista')} />
        )}
      </main>

      <footer style={{ textAlign: 'center', marginTop: '50px', color: '#94a3b8', fontSize: '0.8rem'}}>
        <p>© 2026 FPC Abastecimiento Industrial - Desarrollado con Ferrum</p>
      </footer>
    </div>
  );
}

export default App;
