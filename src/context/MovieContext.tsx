
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

type MovieContextType = {
  favoritas: number[];
  vistas: number[];
  pendientes: number[];
  toggleFavorita: (id: number) => void;
  toggleVista: (id: number) => void;
  togglePendiente: (id: number) => void;
};

const MovieContext = createContext<MovieContextType | undefined>(undefined);

// Los IDs anteriores eran internos; ahora se guardan los IDs reales de TMDB.
const idsAnteriores: Record<number, number> = {
  1: 597, 2: 19995, 3: 299534, 4: 634649, 5: 872585,
  6: 157336, 7: 475557, 8: 603, 9: 106646,
};

function leerIds(categoria: string, usuario: string | null): number[] {
  try {
    const actuales = localStorage.getItem(`tmdb_${categoria}_${usuario}`);
    if (actuales !== null) {
      const ids = JSON.parse(actuales);
      return Array.isArray(ids) ? ids.filter((id) => Number.isInteger(id) && id > 0) : [];
    }
    const anteriores = JSON.parse(localStorage.getItem(`${categoria}_${usuario}`) ?? '[]');
    return Array.isArray(anteriores)
      ? [...new Set<number>(anteriores.map((id: number) => idsAnteriores[id]).filter(Boolean))]
      : [];
  } catch {
    return [];
  }
}

export function MovieProvider({ children }: { children: ReactNode }) {
  const usuario = localStorage.getItem('usuarioActual');

  const [favoritas, setFavoritas] = useState<number[]>(() => {
    return leerIds('favoritas', usuario);
  });

  const [vistas, setVistas] = useState<number[]>(() => {
    return leerIds('vistas', usuario);
  });

  const [pendientes, setPendientes] = useState<number[]>(() => {
    return leerIds('pendientes', usuario);
  });

  useEffect(() => {
    localStorage.setItem(
      `tmdb_favoritas_${usuario}`,
      JSON.stringify(favoritas)
    );
  }, [favoritas, usuario]);

  useEffect(() => {
    localStorage.setItem(
      `tmdb_vistas_${usuario}`,
      JSON.stringify(vistas)
    );
  }, [vistas, usuario]);

  useEffect(() => {
    localStorage.setItem(
      `tmdb_pendientes_${usuario}`,
      JSON.stringify(pendientes)
    );
  }, [pendientes, usuario]);

  function toggleFavorita(id: number) {
    setFavoritas((anteriores) =>
      anteriores.includes(id)
        ? anteriores.filter((peliculaId) => peliculaId !== id)
        : [...anteriores, id]
    );
  }

  function toggleVista(id: number) {
    setVistas((anteriores) =>
      anteriores.includes(id)
        ? anteriores.filter((peliculaId) => peliculaId !== id)
        : [...anteriores, id]
    );
  }

  function togglePendiente(id: number) {
    setPendientes((anteriores) =>
      anteriores.includes(id)
        ? anteriores.filter((peliculaId) => peliculaId !== id)
        : [...anteriores, id]
    );
  }

  return (
    <MovieContext.Provider
      value={{
        favoritas,
        vistas,
        pendientes,
        toggleFavorita,
        toggleVista,
        togglePendiente,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export function useMovies() {
  const context = useContext(MovieContext);

  if (!context) {
    throw new Error('useMovies debe usarse dentro de MovieProvider');
  }

  return context;
}
