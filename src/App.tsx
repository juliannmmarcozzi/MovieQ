import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import CrearCuenta from './pages/CrearCuenta';
import Home from './pages/Home';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/crear-cuenta" element={<CrearCuenta />} />
      </Routes>
    </BrowserRouter>
  );
}