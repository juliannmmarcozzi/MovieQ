
import { useState } from 'react';
import Header from '../components/Header';
import MovieCard from '../components/MovieCard';
import { peliculas } from '../data/peliculas';
import { useMovies } from '../context/MovieContext';

type Categoria = 'favoritas' | 'vistas' | 'pendientes';

export default function MiListaPeliculas() {
  const { favoritas, vistas, pendientes } = useMovies();

  const [categoria, setCategoria] = useState<Categoria>('favoritas');

  const idsSeleccionados =
    categoria === 'favoritas'
      ? favoritas
      : categoria === 'vistas'
      ? vistas
      : pendientes;

  const peliculasSeleccionadas = peliculas.filter((pelicula) =>
    idsSeleccionados.includes(pelicula.id)
  );

  return (
    <div className="min-h-screen bg-[#10182D] text-white font-sans">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-normal mb-3">
          Mi lista
        </h1>

        <p className="text-gray-300 text-sm mb-8">
          Organizá tus películas favoritas, vistas y pendientes.
        </p>

        <div className="flex flex-wrap gap-3 mb-10">
          <button
            type="button"
            onClick={() => setCategoria('favoritas')}
            className={`px-5 py-3 text-sm cursor-pointer transition-colors ${
              categoria === 'favoritas'
                ? 'bg-[#243E70]'
                : 'bg-[#182540] hover:bg-[#243E70]'
            }`}
          >
            Favoritas ({favoritas.length})
          </button>

          <button
            type="button"
            onClick={() => setCategoria('vistas')}
            className={`px-5 py-3 text-sm cursor-pointer transition-colors ${
              categoria === 'vistas'
                ? 'bg-[#243E70]'
                : 'bg-[#182540] hover:bg-[#243E70]'
            }`}
          >
            Vistas ({vistas.length})
          </button>

          <button
            type="button"
            onClick={() => setCategoria('pendientes')}
            className={`px-5 py-3 text-sm cursor-pointer transition-colors ${
              categoria === 'pendientes'
                ? 'bg-[#243E70]'
                : 'bg-[#182540] hover:bg-[#243E70]'
            }`}
          >
            Pendientes ({pendientes.length})
          </button>
        </div>

        {peliculasSeleccionadas.length === 0 ? (
          <div className="bg-[#182540] px-8 py-12 text-center">
            <p className="text-gray-300 text-sm mb-5">
              Todavía no tenés películas en esta lista.
            </p>

            <a
              href="/"
              className="inline-block bg-[#243E70] hover:bg-[#2D4777] px-6 py-3 text-sm transition-colors"
            >
              Explorar películas
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {peliculasSeleccionadas.map((pelicula) => (
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
      </main>
    </div>
  );
}
