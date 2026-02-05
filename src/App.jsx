import { useState, useEffect } from 'react';
import Login from './components/Login';
import QuotationList from './components/QuotationList';
import QuotationForm from './components/QuotationForm';
import './styles/index.css';

function App() {
  const [session, setSession] = useState(null);
  const [view, setView] = useState('list');

  useEffect(() => {
    // Verificar si ya iniciamos sesión antes
    const isLoggedIn = localStorage.getItem('ferrum_session');
    if (isLoggedIn) setSession(true);
  }, []);

  const handleLogin = () => {
    setSession(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('ferrum_session');
    setSession(null);
  };

  if (!session) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="container">
      {view === 'list' ? (
        <QuotationList 
            irAFormulario={() => setView('form')} 
            onLogout={handleLogout} // Pasamos la función de salir
        />
      ) : (
        <QuotationForm alVolver={() => setView('list')} />
      )}
    </div>
  );
}

export default App;