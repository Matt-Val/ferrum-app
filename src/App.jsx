import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import QuotationList from './components/QuotationList';
import QuotationForm from './components/QuotationForm';
import Login from './components/Login';

function App() {
  const [session, setSession] = useState(null);
  const [view, setView] = useState('list'); // 'list' o 'form'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Al cargar la página, preguntamos a Supabase si ya hay un usuario logueado
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Nos suscribimos a cambios (ej: si cierra sesión o se le vence el token)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Elemento invisible para que el PDF funcione
  const logoOculto = (
    <img 
      id="logo-para-pdf" 
      src="/logo.png" 
      alt="Logo FPC" 
      style={{ display: 'none' }} 
    />
  );

  // Pantalla de carga inicial (para que no parpadee el login)
  if (loading) {
    return <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', color: '#ea580c' }}>Cargando sistema...</div>;
  }

  // SI NO HAY SESIÓN -> MOSTRAMOS LOGIN
  if (!session) {
    return (
        <>
            {logoOculto}
            <Login />
        </>
    );
  }

  // SI HAY SESIÓN -> MOSTRAMOS LA APP (Solo Listar y Crear)
  return (
    <div className="container">
      {logoOculto}
      
      {view === 'list' ? (
        <QuotationList irAFormulario={() => setView('form')} />
      ) : (
        <QuotationForm alVolver={() => setView('list')} />
      )}
    </div>
  );
}

export default App;