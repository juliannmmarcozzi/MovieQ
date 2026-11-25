import { useState } from 'react';
import { Link } from 'react-router-dom';

type MovieCardProps = {
  id: number;
  titulo: string;
  anio: number;
  puntuacion: number;
  imagen: string;
};

export default function MovieCard({
  id,
  titulo,
  anio,
  puntuacion,
  imagen,
}: MovieCardProps) {
  const [imagenFallida, setImagenFallida] = useState('');

  return (
    <Link
      to={`/pelicula/${id}`}
      className="block bg-[#182540] overflow-hidden cursor-pointer hover:bg-[#223354] transition-colors"
    >
      <div className="w-full aspect-[2/3] bg-[#243E70] flex items-center justify-center">
        {imagen && imagenFallida !== imagen ? (
          <img
            src={imagen}
            alt={titulo}
            loading="lazy"
            onError={() => setImagenFallida(imagen)}
            className="w-full h-full object-cover"
          />
        ) : (
          <p className="text-gray-300 text-sm text-center px-4">
            Sin imagen disponible
          </p>
        )}
      </div>

      <div className="p-3">
        <h3 className="text-sm font-normal mb-1">
          {titulo}
        </h3>

        <div className="flex justify-between text-xs text-gray-300">
          <span>{anio || 'Sin año'}</span>
          <span>★ {puntuacion}</span>
        </div>
      </div>
    </Link>
  );
}