
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import CrearCuenta from './pages/CrearCuenta';
import Home from './pages/Home';
import DetallePelicula from './pages/DetallePelicula';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/crear-cuenta" element={<CrearCuenta />} />
        <Route path="/pelicula/:id" element={<DetallePelicula />} />
      </Routes>
    </BrowserRouter>
  );
}
