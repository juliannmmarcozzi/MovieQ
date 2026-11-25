export type Pelicula = {
  id: number;
  titulo: string;
  anio: number;
  puntuacion: number;
  imagen: string;
};

export type PeliculaDetalle = Pelicula & {
  genero: string;
  duracion: number;
  sinopsis: string;
  reparto: string[];
  recomendadas: Pelicula[];
};

type PeliculaTMDB = {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  poster_path: string | null;
  overview: string;
};

type ResultadosTMDB = {
  results: PeliculaTMDB[];
};

type DetalleTMDB = PeliculaTMDB & {
  genres: { id: number; name: string }[];
  runtime: number | null;
  credits: {
    cast: { name: string }[];
  };
  recommendations: ResultadosTMDB;
};

const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

async function consultarAPI<T>(
  ruta: string,
  parametros: Record<string, string> = {},
  signal?: AbortSignal
): Promise<T> {
  if (!TOKEN) {
    throw new Error('Falta configurar el token de TMDB.');
  }

  const url = new URL(`${API_URL}${ruta}`);

  url.search = new URLSearchParams({
    language: 'es-ES',
    ...parametros,
  }).toString();

  const respuesta = await fetch(url, {
    signal,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/json',
    },
  });

  if (!respuesta.ok) {
    if (respuesta.status === 401) {
      throw new Error('El token de TMDB no es válido.');
    }

    if (respuesta.status === 404) {
      throw new Error('No se encontró la película.');
    }

    throw new Error('No se pudo obtener información de TMDB.');
  }

  return respuesta.json() as Promise<T>;
}

// Adaptar los datos de TMDB al formato de MovieQ.
function convertirPelicula(pelicula: PeliculaTMDB): Pelicula {
  return {
    id: pelicula.id,
    titulo: pelicula.title,
    anio: Number(pelicula.release_date?.slice(0, 4)) || 0,
    puntuacion: Math.round(pelicula.vote_average * 10) / 10,
    imagen: pelicula.poster_path
      ? `${IMAGE_URL}${pelicula.poster_path}`
      : '',
  };
}

export async function obtenerPeliculasPopulares(
  signal?: AbortSignal
): Promise<Pelicula[]> {
  const datos = await consultarAPI<ResultadosTMDB>(
    '/movie/popular',
    {},
    signal
  );

  return datos.results.map(convertirPelicula);
}

export async function buscarPeliculas(
  busqueda: string,
  signal?: AbortSignal
): Promise<Pelicula[]> {
  const datos = await consultarAPI<ResultadosTMDB>(
    '/search/movie',
    {
      query: busqueda,
      include_adult: 'false',
    },
    signal
  );

  return datos.results.map(convertirPelicula);
}

export async function obtenerPelicula(
  id: number,
  signal?: AbortSignal
): Promise<Pelicula> {
  const datos = await consultarAPI<PeliculaTMDB>(
    `/movie/${id}`,
    {},
    signal
  );

  return convertirPelicula(datos);
}

export async function obtenerDetallePelicula(
  id: number,
  signal?: AbortSignal
): Promise<PeliculaDetalle> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('No se encontró la película.');
  }

  const datos = await consultarAPI<DetalleTMDB>(
    `/movie/${id}`,
    {
      append_to_response: 'credits,recommendations',
    },
    signal
  );

  return {
    ...convertirPelicula(datos),

    genero: datos.genres
      .map((genero) => genero.name)
      .join(', '),

    duracion: datos.runtime ?? 0,

    sinopsis: datos.overview || 'Sinopsis no disponible.',

    reparto: [
      ...new Set(
        (datos.credits?.cast ?? [])
          .slice(0, 8)
          .map((actor) => actor.name)
      ),
    ],

    recomendadas: (datos.recommendations?.results ?? [])
      .filter((pelicula) => pelicula.id !== id)
      .slice(0, 4)
      .map(convertirPelicula),
  };
}