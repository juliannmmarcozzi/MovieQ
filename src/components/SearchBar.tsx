import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

type Props = {
  busqueda: string;
  setBusqueda: (texto: string) => void;
};

export default function SearchBar({ busqueda, setBusqueda }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { hash, key } = useLocation();

  useEffect(() => {
    if (hash === '#buscar') {
      inputRef.current?.scrollIntoView({ block: 'center' });
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [hash, key]);

  return (
    <input
      id="buscar"
      ref={inputRef}
      type="search"
      aria-label="Buscar películas"
      placeholder="Buscar películas..."
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value)}
      className="bg-[#E5EEFC] text-[#10182D] px-3 py-2.5 text-sm w-full sm:w-72 rounded-sm focus:outline-2 focus:outline-blue-400"
    />
  );
}
