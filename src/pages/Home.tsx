import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const usuario = localStorage.getItem('usuarioActual');

  function cerrarSesion() {
    localStorage.removeItem('usuarioActual');
    navigate('/login');
  }

  return (
    <div>
      <h1>Bienvenido a MovieQ</h1>
      <p>Hola, {usuario}!</p>

      <button onClick={cerrarSesion}>
        Cerrar sesión
      </button>
    </div>
  );
}