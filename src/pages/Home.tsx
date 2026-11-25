import { useEffect, useState } from 'react';
import {
  obtenerPelicula,
  buscarPeliculas,
  type Pelicula,
} from '../data/peliculas';

import Header from '../components/Header';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';

// IDs de las películas del inicio.
const peliculasInicio = [
  597,      // Titanic
  1339713,  // Obsession
  157336,   // Interestelar
  299534,   // Avengers: Endgame
  19995,    // Avatar
  872585,   // Oppenheimer
  634649,   // Spider-Man: No Way Home
  533535,   // Deadpool & Wolverine
  475557,   // Joker
  414906,   // The Batman
  603,      // Matrix
  106646,   // El lobo de Wall Street
  693134,   // Dune: Parte dos
  911430,   // F1
  1061474,  // Superman
];

type Resultado = {
  busqueda: string;
  peliculas: Pelicula[];
  error: string;
};

export default function Home() {
  const usuario = localStorage.getItem('usuarioActual');

  const [busqueda, setBusqueda] = useState('');
  const [resultado, setResultado] = useState<Resultado | null>(null);

  const texto = busqueda.trim();

  const cargando = resultado?.busqueda !== texto;

  const peliculas = cargando
    ? []
    : resultado?.peliculas ?? [];

  const error = cargando
    ? ''
    : resultado?.error ?? '';

  useEffect(() => {
    const controlador = new AbortController();

    async function cargarPeliculas() {
      try {
        let datos: Pelicula[];

        if (texto) {
          datos = await buscarPeliculas(
            texto,
            controlador.signal
          );
        } else {
          const resultados = await Promise.allSettled(
            peliculasInicio.map((id) =>
              obtenerPelicula(id, controlador.signal)
            )
          );

          datos = resultados.flatMap((resultado) =>
            resultado.status === 'fulfilled'
              ? [resultado.value]
              : []
          );

          if (datos.length === 0) {
            throw new Error('Error');
          }
        }

        if (!controlador.signal.aborted) {
          setResultado({
            busqueda: texto,
            peliculas: datos,
            error: '',
          });
        }
      } catch {
        if (!controlador.signal.aborted) {
          setResultado({
            busqueda: texto,
            peliculas: [],
            error: 'Error',
          });
        }
      }
    }

    const temporizador = setTimeout(
      cargarPeliculas,
      texto ? 350 : 0
    );

    return () => {
      clearTimeout(temporizador);
      controlador.abort();
    };
  }, [texto]);

  return (
    <div className="min-h-screen bg-[#10182D] text-white font-sans">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <section
          id="inicio"
          className="bg-[#182540] px-8 py-10 mb-12"
        >
          <h2 className="text-3xl font-normal mb-6">
            Bienvenido a MovieQ{usuario ? `, ${usuario}` : ''}
          </h2>

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
              {texto
                ? 'Resultados de búsqueda'
                : 'Películas'}
            </h2>

            <SearchBar
              busqueda={busqueda}
              setBusqueda={setBusqueda}
            />
          </div>

          {cargando ? (
            <p className="text-gray-400 text-sm">
              Cargando...
            </p>
          ) : error ? (
            <p className="text-red-400 text-sm">
              {error}
            </p>
          ) : peliculas.length === 0 ? (
            <p className="text-gray-400 text-sm">
              Sin resultados.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {peliculas.map((pelicula) => (
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