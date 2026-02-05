import { useState } from 'react';
import '../styles/login.css';

export default function Login({ onLogin }) { // Recibimos la función onLogin
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Simulación de carga
        setTimeout(() => {
            // Guardamos sesión "falsa" en el navegador
            localStorage.setItem('ferrum_session', 'true');
            // Avisamos a la App que entramos
            if(onLogin) onLogin();
            setLoading(false);
        }, 800);
    };

    return (
        <div className="login-container fade-in">
            <div className="login-card">
                <div className="login-logo">FERRUM</div>
                <p className="login-subtitle">Sistema de Cotizaciones</p>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <label>Usuario</label>
                        <input 
                            type="text" 
                            placeholder="admin"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label>Contraseña</label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="btn-login" disabled={loading}>
                        {loading ? 'Accediendo...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
}