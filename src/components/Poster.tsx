import { useState } from 'react';

export default function Poster({ imagen, titulo }: { imagen: string; titulo: string }) {
  const [fallida, setFallida] = useState('');

  return (
    <div className="w-full aspect-[2/3] bg-[#243E70] flex items-center justify-center">
      {imagen && fallida !== imagen ? (
        <img
          src={imagen}
          alt={titulo}
          loading="lazy"
          onError={() => setFallida(imagen)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-gray-300 text-xs px-3 text-center">Sin imagen disponible</span>
      )}
    </div>
  );
}
