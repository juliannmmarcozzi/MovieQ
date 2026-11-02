
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  function cerrarSesion() {
    localStorage.removeItem('usuarioActual');
    navigate('/login');
  }

  return (
    <header className="border-b border-white/10 bg-[#10182D]">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="text-xl font-normal text-white">
          MovieQ
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link to="/" className="text-gray-300 hover:text-white">
            Inicio
          </Link>

          <Link to="/#peliculas" className="text-gray-300 hover:text-white">
            Buscar
          </Link>

          <button
            type="button"
            onClick={cerrarSesion}
            className="text-gray-300 hover:text-white cursor-pointer"
          >
            Cerrar sesión
          </button>
        </nav>
      </div>
    </header>
  );
}
