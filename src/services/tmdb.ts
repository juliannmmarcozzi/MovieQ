export type Pelicula = {
  id: number;
  titulo: string;
  anio: number;
  puntuacion: number;
  imagen: string;
};

type PeliculaTMDB = {
  id: number;
  title: string;
  release_date?: string;
  vote_average: number;
  poster_path: string | null;
  overview: string;
};

type Resultados = { results: PeliculaTMDB[] };

type DetalleTMDB = PeliculaTMDB & {
  genres: { id: number; name: string }[];
  runtime: number | null;
  credits?: { cast: { name: string }[] };
  recommendations?: Resultados;
};

export type Detalle = Pelicula & {
  genero: string;
  duracion: number;
  sinopsis: string;
  reparto: string[];
  recomendadas: Pelicula[];
};

const API = 'https://api.themoviedb.org/3';

async function consultar<T>(
  ruta: string,
  signal?: AbortSignal,
  parametros: Record<string, string> = {}
): Promise<T> {
  const token = import.meta.env.VITE_TMDB_TOKEN?.trim();
  if (!token) {
    throw new Error('Falta configurar VITE_TMDB_TOKEN en .env.local.');
  }

  const url = new URL(API + ruta);
  url.search = new URLSearchParams({
    language: 'es-ES',
    ...parametros,
  }).toString();

  const respuesta = await fetch(url, {
    signal,
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
    },
  });

  if (!respuesta.ok) {
    if (respuesta.status === 401 || respuesta.status === 403) {
      throw new Error('El token de TMDB no es válido o no tiene acceso.');
    }
    if (respuesta.status === 404) {
      throw new Error('No se encontró la película.');
    }
    throw new Error('No se pudo conectar con TMDB (' + respuesta.status + ').');
  }

  return respuesta.json() as Promise<T>;
}

function convertir(pelicula: PeliculaTMDB): Pelicula {
  return {
    id: pelicula.id,
    titulo: pelicula.title,
    anio: Number(pelicula.release_date?.slice(0, 4)) || 0,
    puntuacion: Math.round(pelicula.vote_average * 10) / 10,
    imagen: pelicula.poster_path
      ? 'https://image.tmdb.org/t/p/w500' + pelicula.poster_path
      : '',
  };
}

export async function buscarPeliculas(busqueda: string, signal?: AbortSignal) {
  const texto = busqueda.trim();
  const datos = texto
    ? await consultar<Resultados>('/search/movie', signal, {
        query: texto,
        include_adult: 'false',
      })
    : await consultar<Resultados>('/movie/popular', signal);
  return datos.results.map(convertir);
}

export async function obtenerPelicula(id: number, signal?: AbortSignal) {
  const datos = await consultar<PeliculaTMDB>('/movie/' + id, signal);
  return convertir(datos);
}

export async function obtenerDetalle(id: number, signal?: AbortSignal): Promise<Detalle> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('No se encontró la película.');
  }

  const datos = await consultar<DetalleTMDB>('/movie/' + id, signal, {
    append_to_response: 'credits,recommendations',
  });

  return {
    ...convertir(datos),
    genero: datos.genres.map((genero) => genero.name).join(', '),
    duracion: datos.runtime ?? 0,
    sinopsis: datos.overview || 'No hay una sinopsis disponible.',
    reparto: [...new Set((datos.credits?.cast ?? []).map((actor) => actor.name))].slice(0, 8),
    recomendadas: (datos.recommendations?.results ?? [])
      .filter((pelicula) => pelicula.id !== id)
      .slice(0, 4)
      .map(convertir),
  };
}
