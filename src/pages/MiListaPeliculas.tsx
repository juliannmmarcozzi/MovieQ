import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Header from '../components/Header';
import MovieCard from '../components/MovieCard';

import {
  obtenerPelicula,
  type Pelicula,
} from '../data/peliculas';

import { useMovies } from '../context/MovieContext';

type Categoria = 'favoritas' | 'vistas' | 'pendientes';

type Resultado = {
  clave: string;
  peliculas: Pelicula[];
  errores: number;
};

export default function MiListaPeliculas() {
  const { favoritas, vistas, pendientes } = useMovies();

  const [categoria, setCategoria] = useState<Categoria>('favoritas');
  const [resultado, setResultado] = useState<Resultado | null>(null);

  const idsSeleccionados =
    categoria === 'favoritas'
      ? favoritas
      : categoria === 'vistas'
      ? vistas
      : pendientes;

  const clave = `${categoria}:${idsSeleccionados.join(',')}`;

  const cargando = resultado?.clave !== clave;

  const peliculasSeleccionadas = cargando
    ? []
    : resultado?.peliculas ?? [];

  const errores = cargando
    ? 0
    : resultado?.errores ?? 0;

  useEffect(() => {
    const controlador = new AbortController();

    async function cargarPeliculas() {
      const resultados = await Promise.allSettled(
        idsSeleccionados.map((id) =>
          obtenerPelicula(id, controlador.signal)
        )
      );

      const peliculas: Pelicula[] = [];

      let errores = 0;

      resultados.forEach((resultado) => {
        if (resultado.status === 'fulfilled') {
          peliculas.push(resultado.value);
        } else {
          errores++;
        }
      });

      if (!controlador.signal.aborted) {
        setResultado({
          clave,
          peliculas,
          errores,
        });
      }
    }

    cargarPeliculas();

    return () => controlador.abort();
  }, [idsSeleccionados, clave]);

  return (
    <div className="min-h-screen bg-[#10182D] text-white font-sans">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-normal mb-8">
          Mi lista
        </h1>

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

        {errores > 0 && (
          <p className="text-red-400 text-sm mb-5">
            Error
          </p>
        )}

        {cargando ? (
          <p className="text-gray-400 text-sm">
            Cargando...
          </p>
        ) : idsSeleccionados.length === 0 ? (
          <div className="bg-[#182540] px-8 py-12 text-center">
            <p className="text-gray-300 text-sm mb-5">
              Lista vacía
            </p>

            <Link
              to="/"
              className="inline-block bg-[#243E70] hover:bg-[#2D4777] px-6 py-3 text-sm transition-colors"
            >
              Explorar películas
            </Link>
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