
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type Cuenta = {
  usuario: string;
  contrasena: string;
};

export default function CrearCuenta() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  function registrarCuenta(e: FormEvent<HTMLFormElement>) {
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

    localStorage.setItem(
      'cuentas',
      JSON.stringify([...cuentas, nuevaCuenta])
    );

    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-[#10182D] flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-[370px] text-white">
        <h1 className="text-2xl font-normal text-center mb-7">
          Crear cuenta
        </h1>

        <form onSubmit={registrarCuenta} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            autoComplete="username"
            className="w-full bg-[#E5EEFC] text-[#10182D] px-3 py-3 rounded-sm outline-none text-sm"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            autoComplete="new-password"
            className="w-full bg-[#E5EEFC] text-[#10182D] px-3 py-3 rounded-sm outline-none text-sm"
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
            Crear cuenta
          </button>
        </form>

        <p className="text-center text-sm text-gray-300 mt-6">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-white hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
