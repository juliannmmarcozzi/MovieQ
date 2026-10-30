import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type Cuenta = {
  usuario: string;
  contrasena: string;
};

export default function Login() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  function iniciarSesion() {
    setError('');

    if (usuario.trim() === '' || contrasena.trim() === '') {
      setError('Completá todos los campos');
      return;
    }

    const cuentasGuardadas = localStorage.getItem('cuentas');

    const cuentas: Cuenta[] = cuentasGuardadas
      ? JSON.parse(cuentasGuardadas)
      : [];

    const cuentaEncontrada = cuentas.find(
      (cuenta) =>
        cuenta.usuario === usuario &&
        cuenta.contrasena === contrasena
    );

    if (!cuentaEncontrada) {
      setError('Usuario o contraseña incorrectos');
      return;
    }

    localStorage.setItem('usuarioActual', cuentaEncontrada.usuario);

    navigate('/');
  }

  return (
    <div>
      <h1>Iniciar sesión</h1>

      <input
        type="text"
        placeholder="Usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
      />

      <button onClick={iniciarSesion}>
        Iniciar sesión
      </button>

      <p>
        ¿No tenés cuenta? <Link to="/crear-cuenta">Crear cuenta</Link>
      </p>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}