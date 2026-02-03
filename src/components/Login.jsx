import { useState } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/login.css'; // Asegúrate de tener el CSS que creamos antes

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Intentamos iniciar sesión con Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError("Credenciales incorrectas. Verifique su correo y contraseña.");
            setLoading(false);
        }
        // Si no hay error, App.jsx detectará el cambio de sesión automáticamente
    };

    return (
        <div className="login-container fade-in">
            <div className="login-card">
                <div className="login-logo">FERRUM</div>
                <p className="login-subtitle">Acceso Seguro</p>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <label>Correo Corporativo</label>
                        <input 
                            type="email" 
                            placeholder="usuario@dominio.cl"
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
                        {loading ? 'Verificando...' : 'Ingresar al Sistema'}
                    </button>
                </form>
            </div>
        </div>
    );
}