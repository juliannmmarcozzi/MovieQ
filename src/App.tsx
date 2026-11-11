
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import { MovieProvider } from './context/MovieContext';

import Login from './pages/Login';
import CrearCuenta from './pages/CrearCuenta';
import Home from './pages/Home';
import DetallePelicula from './pages/DetallePelicula';
import MiListaPeliculas from './pages/MiListaPeliculas';

function Rutas() {
  const { usuario } = useAuth();

  return (
    <MovieProvider key={usuario ?? 'sin-sesion'}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/crear-cuenta" element={<CrearCuenta />} />
        <Route path="/pelicula/:id" element={<DetallePelicula />} />
        <Route path="/mi-lista" element={<MiListaPeliculas />} />
      </Routes>
    </MovieProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Rutas />
      </AuthProvider>
    </BrowserRouter>
  );
}
