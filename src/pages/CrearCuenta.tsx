import { useState } from 'react';
import { Link } from 'react-router-dom';

type Cuenta = {
  usuario: string;
  contrasena: string;
};

export default function CrearCuenta() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  function registrarCuenta() {
    setError('');
    setMensaje('');

    if (usuario.trim() === '' || contrasena.trim() === '') {
      setError('Completá todos los campos');
      return;
    }

    const cuentasGuardadas = localStorage.getItem('cuentas');

    const cuentas: Cuenta[] = cuentasGuardadas
      ? JSON.parse(cuentasGuardadas)
      : [];

    const usuarioExiste = cuentas.some(
      (cuenta) => cuenta.usuario === usuario.trim()
    );

    if (usuarioExiste) {
      setError('Ese nombre de usuario ya está registrado');
      return;
    }

    const nuevaCuenta: Cuenta = {
      usuario: usuario.trim(),
      contrasena: contrasena,
    };

    const nuevasCuentas = [...cuentas, nuevaCuenta];

    localStorage.setItem('cuentas', JSON.stringify(nuevasCuentas));

    setMensaje('Cuenta creada correctamente');
    setUsuario('');
    setContrasena('');
  }

  return (
    <div>
      <h1>Crear cuenta</h1>

      <input
        type="text"
        placeholder="Nombre de usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
      />

      <button onClick={registrarCuenta}>
        Crear cuenta
      </button>

      <p>
        ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
     </p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
    </div>
  );
}