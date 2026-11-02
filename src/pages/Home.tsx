
import { useState } from 'react';
import { peliculas } from '../data/peliculas';
import Header from '../components/Header';
import MovieCard from '../components/MovieCard';

export default function Home() {
  const usuario = localStorage.getItem('usuarioActual');
  const [busqueda, setBusqueda] = useState('');

  const peliculasFiltradas = peliculas.filter((pelicula) =>
    pelicula.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#10182D] text-white font-sans">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <section id="inicio" className="bg-[#182540] px-8 py-12 mb-12">
          <h2 className="text-3xl font-normal mb-3">
            Bienvenido a MovieQ{usuario ? `, ${usuario}` : ''}
          </h2>

          <p className="text-gray-300 text-sm mb-6">
            Explorá películas y guardá las que quieras ver.
          </p>

          <a
            href="#peliculas"
            className="inline-block bg-[#243E70] hover:bg-[#2D4777] px-6 py-2.5 text-sm transition-colors"
          >
            Explorar películas
          </a>
        </section>

        <section id="peliculas">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl font-normal">
              Películas
            </h2>

            <input
              type="text"
              placeholder="Buscar películas..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="bg-[#E5EEFC] text-[#10182D] px-3 py-2.5 text-sm outline-none w-full sm:w-72 rounded-sm"
            />
          </div>

          {peliculasFiltradas.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No se encontraron películas.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {peliculasFiltradas.map((pelicula) => (
                <MovieCard
                  key={pelicula.id}
                  id={pelicula.id}
                  titulo={pelicula.titulo}
                  anio={pelicula.anio}
                  puntuacion={pelicula.puntuacion}
                  imagen={pelicula.imagen}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
