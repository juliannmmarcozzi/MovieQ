import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

type SearchBarProps = {
  busqueda: string;
  setBusqueda: (texto: string) => void;
};

export default function SearchBar({
  busqueda,
  setBusqueda,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#buscar') {
      inputRef.current?.scrollIntoView({
        block: 'center',
      });

      inputRef.current?.focus({
        preventScroll: true,
      });
    }
  }, [location.hash, location.key]);

  return (
    <input
      id="buscar"
      ref={inputRef}
      type="search"
      aria-label="Buscar películas"
      placeholder="Buscar películas..."
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value)}
      className="bg-[#E5EEFC] text-[#10182D] px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-72 rounded-sm"
    />
  );
}