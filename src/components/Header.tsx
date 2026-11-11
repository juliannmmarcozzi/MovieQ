
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const navigate = useNavigate();
  const { usuario, cerrarSesion } = useAuth();

  function salir() {
    cerrarSesion();
    navigate('/login');
  }

  return (
    <header className="border-b border-white/10 bg-[#10182D]">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="text-xl font-normal text-white">
          MovieQ
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link
            to="/"
            className="text-gray-300 hover:text-white"
          >
            Inicio
          </Link>

          <Link
            to="/#peliculas"
            className="text-gray-300 hover:text-white"
          >
            Buscar
          </Link>

          <Link
            to="/mi-lista"
            className="text-gray-300 hover:text-white"
          >
            Mi lista
          </Link>

          {usuario ? (
            <button
              type="button"
              onClick={salir}
              className="text-gray-300 hover:text-white cursor-pointer"
            >
              Cerrar sesión
            </button>
          ) : (
            <Link
              to="/login"
              className="text-gray-300 hover:text-white"
            >
              Iniciar sesión
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
