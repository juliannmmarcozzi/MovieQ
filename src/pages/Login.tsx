
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Cuenta = {
  usuario: string;
  contrasena: string;
};

export default function Login() {
  const navigate = useNavigate();
  const { iniciarSesion } = useAuth();

  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  function manejarLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
        cuenta.usuario === usuario.trim() &&
        cuenta.contrasena === contrasena
    );

    if (!cuentaEncontrada) {
      setError('Usuario o contraseña incorrectos');
      return;
    }

    iniciarSesion(cuentaEncontrada.usuario);
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-[#10182D] flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-[370px] text-white">
        <h1 className="text-2xl font-normal text-center mb-7">
          Iniciar sesión
        </h1>

        <form onSubmit={manejarLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            autoComplete="username"
            className="w-full bg-white text-[#10182D] px-3 py-3 rounded-sm outline-none text-sm"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            autoComplete="current-password"
            className="w-full bg-white text-[#10182D] px-3 py-3 rounded-sm outline-none text-sm"
          />

          {error && (
            <p className="text-red-400 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="bg-[#243E70] hover:bg-[#2D4777] text-white py-3 rounded-sm text-sm font-normal cursor-pointer transition-colors"
          >
            Iniciar sesión
          </button>
        </form>

        <p className="text-center text-sm text-gray-300 mt-6">
          ¿No tenés cuenta?{' '}
          <Link
            to="/crear-cuenta"
            className="text-white hover:underline"
          >
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}
