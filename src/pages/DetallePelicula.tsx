import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  obtenerDetallePelicula,
  type PeliculaDetalle,
} from '../data/peliculas';

import Header from '../components/Header';
import MovieCard from '../components/MovieCard';
import Resenas from '../components/Resenas';
import { useMovies } from '../context/MovieContext';

type Resultado = {
  id: string;
  pelicula: PeliculaDetalle | null;
  error: string;
};

export default function DetallePelicula() {
  const { id } = useParams();

  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [imagenFallida, setImagenFallida] = useState('');

  const peliculaId = id ?? '';

  const cargando = resultado?.id !== peliculaId;

  const pelicula = cargando
    ? null
    : resultado?.pelicula ?? null;

  const error = cargando
    ? ''
    : resultado?.error ?? '';

  const {
    favoritas,
    vistas,
    pendientes,
    toggleFavorita,
    toggleVista,
    togglePendiente,
  } = useMovies();

  useEffect(() => {
    const controlador = new AbortController();

    async function cargarPelicula() {
      try {
        const datos = await obtenerDetallePelicula(
          Number(peliculaId),
          controlador.signal
        );

        if (!controlador.signal.aborted) {
          setResultado({
            id: peliculaId,
            pelicula: datos,
            error: '',
          });
        }
      } catch (error) {
        if (!controlador.signal.aborted) {
          setResultado({
            id: peliculaId,
            pelicula: null,
            error:
              error instanceof Error
                ? error.message
                : 'No se pudo cargar la película.',
          });
        }
      }
    }

    cargarPelicula();

    return () => controlador.abort();
  }, [peliculaId]);

  if (cargando || !pelicula) {
    return (
      <div className="min-h-screen bg-[#10182D] text-white font-sans">
        <Header />

        <main className="max-w-6xl mx-auto px-6 py-10">
          <p className="mb-4">
            {cargando
              ? 'Cargando película...'
              : error || 'No se encontró la película.'}
          </p>

          <Link to="/" className="text-blue-300 hover:text-white">
            Volver al inicio
          </Link>
        </main>
      </div>
    );
  }

  const esFavorita = favoritas.includes(pelicula.id);
  const estaVista = vistas.includes(pelicula.id);
  const estaPendiente = pendientes.includes(pelicula.id);

  const recomendadas = pelicula.recomendadas;

  return (
    <div className="min-h-screen bg-[#10182D] text-white font-sans">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="w-full max-w-[270px] shrink-0">
            {pelicula.imagen && imagenFallida !== pelicula.imagen ? (
              <img
                src={pelicula.imagen}
                alt={pelicula.titulo}
                onError={() => setImagenFallida(pelicula.imagen)}
                className="w-full object-cover"
              />
            ) : (
              <div className="aspect-[2/3] bg-[#243E70] flex items-center justify-center">
                <p className="text-gray-300 text-sm">
                  Sin imagen disponible
                </p>
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-normal mb-4">
              {pelicula.titulo}
            </h1>

            <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-7">
              <span>{pelicula.anio || 'Sin año'}</span>
              <span>★ {pelicula.puntuacion} (TMDB)</span>

              <span>
                {pelicula.duracion
                  ? `${pelicula.duracion} min`
                  : 'Duración no disponible'}
              </span>

              <span>{pelicula.genero}</span>
            </div>

            <h2 className="text-lg mb-3">
              Sinopsis
            </h2>

            <p className="text-gray-300 text-sm leading-7 max-w-2xl mb-8">
              {pelicula.sinopsis}
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <button
                type="button"
                onClick={() => toggleFavorita(pelicula.id)}
                className={`px-5 py-3 text-sm cursor-pointer transition-colors ${
                  esFavorita
                    ? 'bg-red-700 hover:bg-red-800'
                    : 'bg-[#243E70] hover:bg-[#2D4777]'
                }`}
              >
                {esFavorita
                  ? '♥ Quitar de favoritos'
                  : '♡ Agregar a favoritos'}
              </button>

              <button
                type="button"
                onClick={() => toggleVista(pelicula.id)}
                className={`px-5 py-3 text-sm cursor-pointer transition-colors ${
                  estaVista
                    ? 'bg-green-700 hover:bg-green-800'
                    : 'border border-white/20 hover:bg-white/10'
                }`}
              >
                {estaVista
                  ? '✓ Vista'
                  : 'Marcar como vista'}
              </button>

              <button
                type="button"
                onClick={() => togglePendiente(pelicula.id)}
                className={`px-5 py-3 text-sm cursor-pointer transition-colors ${
                  estaPendiente
                    ? 'bg-[#375A91] hover:bg-[#456CA8]'
                    : 'border border-white/20 hover:bg-white/10'
                }`}
              >
                {estaPendiente
                  ? '✓ En pendientes'
                  : 'Ver más tarde'}
              </button>
            </div>

            <h2 className="text-lg mb-4">
              Reparto
            </h2>

            <div className="flex flex-wrap gap-3">
              {pelicula.reparto.length === 0 ? (
                <p className="text-gray-400 text-sm">
                  No hay información del reparto.
                </p>
              ) : (
                pelicula.reparto.map((actor) => (
                  <div
                    key={actor}
                    className="bg-[#182540] px-4 py-3 text-sm text-gray-200"
                  >
                    {actor}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <Resenas
          key={pelicula.id}
          peliculaId={pelicula.id}
        />

        <section className="mt-14">
          <h2 className="text-xl mb-6">
            Películas que podrían gustarte
          </h2>

          {recomendadas.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No hay películas relacionadas por ahora.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {recomendadas.map((pelicula) => (
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