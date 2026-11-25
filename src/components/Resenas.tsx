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

const CLAVE = 'movieq_resenas';

function leerResenas(): Resena[] {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE) ?? '[]');
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

export default function Resenas({ peliculaId }: { peliculaId: number }) {
  const { usuario } = useAuth();
  const [resenas, setResenas] = useState(leerResenas);
  const propias = resenas.find((r) => r.peliculaId === peliculaId && r.usuario === usuario);
  const [puntuacion, setPuntuacion] = useState(propias?.puntuacion ?? 0);
  const [comentario, setComentario] = useState(propias?.comentario ?? '');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const dePelicula = resenas.filter((r) => r.peliculaId === peliculaId);
  const promedio = dePelicula.length
    ? dePelicula.reduce((total, r) => total + r.puntuacion, 0) / dePelicula.length
    : 0;

  function guardar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError('');
    setMensaje('');
    if (!usuario) return;
    if (puntuacion < 1 || puntuacion > 5 || !comentario.trim() || comentario.trim().length > 1000) {
      setError('Elegí de 1 a 5 estrellas y escribí una reseña de hasta 1000 caracteres.');
      return;
    }

    const actualizadas = [
      ...leerResenas().filter((r) => !(r.peliculaId === peliculaId && r.usuario === usuario)),
      { peliculaId, usuario, puntuacion, comentario: comentario.trim(), fecha: new Date().toISOString() },
    ];

    try {
      localStorage.setItem(CLAVE, JSON.stringify(actualizadas));
      setResenas(actualizadas);
      setMensaje('Reseña guardada.');
    } catch {
      setError('No se pudo guardar la reseña en este navegador.');
    }
  }

  function eliminar() {
    if (!usuario) return;
    setError('');
    setMensaje('');
    const actualizadas = leerResenas().filter(
      (r) => !(r.peliculaId === peliculaId && r.usuario === usuario)
    );
    try {
      localStorage.setItem(CLAVE, JSON.stringify(actualizadas));
      setResenas(actualizadas);
      setPuntuacion(0);
      setComentario('');
      setMensaje('Reseña eliminada.');
    } catch {
      setError('No se pudo eliminar la reseña.');
    }
  }

  return (
    <section className="mt-14">
      <h2 className="text-xl mb-2">Reseñas de MovieQ</h2>
      <p className="text-gray-300 text-sm mb-6">
        {dePelicula.length ? '★ ' + promedio.toFixed(1) + '/5 · ' + dePelicula.length + ' reseñas' : 'Todavía no hay reseñas.'}
      </p>

      {usuario ? (
        <form onSubmit={guardar} className="bg-[#182540] p-6 mb-6">
          <h3 className="text-base mb-3">{propias ? 'Editar tu reseña' : 'Escribí tu reseña'}</h3>
          <div role="group" aria-label="Puntuación" className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((valor) => (
              <button
                key={valor}
                type="button"
                aria-label={valor + ' estrellas'}
                aria-pressed={puntuacion === valor}
                onClick={() => setPuntuacion(valor)}
                className={'text-3xl cursor-pointer ' + (valor <= puntuacion ? 'text-yellow-400' : 'text-gray-400')}
              >
                {valor <= puntuacion ? '★' : '☆'}
              </button>
            ))}
          </div>
          <textarea
            aria-label="Tu opinión"
            placeholder="¿Qué te pareció la película?"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            required
            maxLength={1000}
            rows={4}
            className="w-full bg-[#E5EEFC] text-[#10182D] p-3 text-sm mb-3 rounded-sm"
          />
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="bg-[#243E70] hover:bg-[#2D4777] px-5 py-3 text-sm cursor-pointer">
              {propias ? 'Guardar cambios' : 'Publicar reseña'}
            </button>
            {propias && (
              <button type="button" onClick={eliminar} className="border border-white/20 px-5 py-3 text-sm cursor-pointer">
                Eliminar reseña
              </button>
            )}
          </div>
          {error && <p role="alert" className="text-red-300 text-sm mt-3">{error}</p>}
          {mensaje && <p role="status" className="text-green-300 text-sm mt-3">{mensaje}</p>}
        </form>
      ) : (
        <p className="text-gray-300 text-sm mb-6">
          <Link to="/login" className="text-blue-300 underline">Iniciá sesión</Link> para dejar tu reseña.
        </p>
      )}

      <div className="space-y-3">
        {dePelicula.map((resena) => (
          <article key={resena.usuario} className="bg-[#182540] p-5">
            <div className="flex justify-between gap-3 mb-2">
              <h3 className="text-sm font-medium">{resena.usuario}</h3>
              <span className="text-yellow-400 text-sm" aria-label={resena.puntuacion + ' de 5 estrellas'}>
                {'★'.repeat(resena.puntuacion)}{'☆'.repeat(5 - resena.puntuacion)}
              </span>
            </div>
            <p className="text-gray-300 text-sm whitespace-pre-wrap break-words">{resena.comentario}</p>
            <p className="text-gray-400 text-xs mt-3">{new Date(resena.fecha).toLocaleDateString('es-AR')}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
