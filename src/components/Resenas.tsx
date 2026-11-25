import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Resena = {
  peliculaId: number;
  usuario: string;
  puntuacion: number;
  comentario: string;
  fecha: string;
};

type ResenasProps = {
  peliculaId: number;
};

function obtenerResenas(): Resena[] {
  try {
    const guardadas = localStorage.getItem('movieq_resenas');
    const datos = guardadas ? JSON.parse(guardadas) : [];

    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

export default function Resenas({ peliculaId }: ResenasProps) {
  const { usuario } = useAuth();

  const [resenas, setResenas] = useState<Resena[]>(obtenerResenas);

  const resenaPropia = resenas.find(
    (resena) =>
      resena.peliculaId === peliculaId &&
      resena.usuario === usuario
  );

  const [puntuacion, setPuntuacion] = useState(
    resenaPropia?.puntuacion ?? 0
  );

  const [comentario, setComentario] = useState(
    resenaPropia?.comentario ?? ''
  );

  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const resenasPelicula = resenas.filter(
    (resena) => resena.peliculaId === peliculaId
  );

  // Calcular el promedio de las puntuaciones.
  let total = 0;

  for (let i = 0; i < resenasPelicula.length; i++) {
    total += resenasPelicula[i].puntuacion;
  }

  const promedio =
    resenasPelicula.length > 0
      ? total / resenasPelicula.length
      : 0;

  function publicarResena(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError('');
    setMensaje('');

    if (!usuario) {
      setError('Iniciá sesión.');
      return;
    }

    if (puntuacion < 1 || puntuacion > 5) {
      setError('Seleccioná una puntuación.');
      return;
    }

    if (comentario.trim() === '') {
      setError('Completá la reseña.');
      return;
    }

    if (comentario.trim().length > 1000) {
      setError('Máximo 1000 caracteres.');
      return;
    }

    const nuevaResena: Resena = {
      peliculaId,
      usuario,
      puntuacion,
      comentario: comentario.trim(),
      fecha: new Date().toISOString(),
    };

    const resenasActualizadas = [
      ...obtenerResenas().filter(
        (resena) =>
          !(
            resena.peliculaId === peliculaId &&
            resena.usuario === usuario
          )
      ),
      nuevaResena,
    ];

    try {
      localStorage.setItem(
        'movieq_resenas',
        JSON.stringify(resenasActualizadas)
      );

      setResenas(resenasActualizadas);
      setMensaje('Reseña guardada.');
    } catch {
      setError('Error');
    }
  }

  function eliminarResena() {
    if (!usuario) {
      return;
    }

    const resenasActualizadas = obtenerResenas().filter(
      (resena) =>
        !(
          resena.peliculaId === peliculaId &&
          resena.usuario === usuario
        )
    );

    try {
      localStorage.setItem(
        'movieq_resenas',
        JSON.stringify(resenasActualizadas)
      );

      setResenas(resenasActualizadas);
      setPuntuacion(0);
      setComentario('');
      setError('');
      setMensaje('Reseña eliminada.');
    } catch {
      setError('Error');
      setMensaje('');
    }
  }

  return (
    <section className="mt-14">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl">
          Reseñas
        </h2>

        {resenasPelicula.length > 0 && (
          <p className="text-sm text-gray-300">
            <span className="text-yellow-400">
              ★ {promedio.toFixed(1)}/5
            </span>

            {' · '}

            {resenasPelicula.length}{' '}
            {resenasPelicula.length === 1 ? 'reseña' : 'reseñas'}
          </p>
        )}
      </div>

      {usuario ? (
        <form
          onSubmit={publicarResena}
          className="bg-[#182540] p-6 mb-8"
        >
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((estrella) => (
              <button
                key={estrella}
                type="button"
                aria-label={`${estrella} estrellas`}
                aria-pressed={puntuacion === estrella}
                onClick={() => setPuntuacion(estrella)}
                className={`text-3xl cursor-pointer transition-colors ${
                  estrella <= puntuacion
                    ? 'text-yellow-400'
                    : 'text-gray-500 hover:text-yellow-300'
                }`}
              >
                {estrella <= puntuacion ? '★' : '☆'}
              </button>
            ))}
          </div>

          <textarea
            placeholder="Escribí tu reseña..."
            aria-label="Reseña"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            maxLength={1000}
            rows={4}
            className="w-full bg-[#E5EEFC] text-[#10182D] p-4 text-sm outline-none rounded-sm resize-y"
          />

          <p className="text-right text-xs text-gray-400 mb-5">
            {comentario.length}/1000
          </p>

          {error && (
            <p className="text-red-400 text-sm mb-4">
              {error}
            </p>
          )}

          {mensaje && (
            <p className="text-green-400 text-sm mb-4">
              {mensaje}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="bg-[#243E70] hover:bg-[#2D4777] px-5 py-3 text-sm cursor-pointer transition-colors"
            >
              {resenaPropia
                ? 'Guardar cambios'
                : 'Publicar reseña'}
            </button>

            {resenaPropia && (
              <button
                type="button"
                onClick={eliminarResena}
                className="border border-red-500/50 text-red-400 hover:bg-red-500/10 px-5 py-3 text-sm cursor-pointer transition-colors"
              >
                Eliminar
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="bg-[#182540] p-6 mb-8">
          <p className="text-gray-300 text-sm">
            <Link
              to="/login"
              className="text-blue-300 hover:underline"
            >
              Iniciá sesión
            </Link>
            {' '}para publicar una reseña.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {resenasPelicula.map((resena) => (
          <article
            key={resena.usuario}
            className="bg-[#182540] p-5"
          >
            <div className="flex justify-between items-center gap-3 mb-3">
              <div>
                <h3 className="text-sm text-white">
                  {resena.usuario}
                </h3>

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(resena.fecha).toLocaleDateString('es-AR')}
                </p>
              </div>

              <span
                aria-label={`${resena.puntuacion} de 5 estrellas`}
                className="text-yellow-400 text-lg"
              >
                {'★'.repeat(resena.puntuacion)}
                {'☆'.repeat(5 - resena.puntuacion)}
              </span>
            </div>

            <p className="text-gray-300 text-sm leading-6 whitespace-pre-wrap break-words">
              {resena.comentario}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}