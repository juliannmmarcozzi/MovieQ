
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

export function MovieProvider({ children }: { children: ReactNode }) {
  const usuario = localStorage.getItem('usuarioActual');

  const [favoritas, setFavoritas] = useState<number[]>(() => {
    const guardadas = localStorage.getItem(`favoritas_${usuario}`);
    return guardadas ? JSON.parse(guardadas) : [];
  });

  const [vistas, setVistas] = useState<number[]>(() => {
    const guardadas = localStorage.getItem(`vistas_${usuario}`);
    return guardadas ? JSON.parse(guardadas) : [];
  });

  const [pendientes, setPendientes] = useState<number[]>(() => {
    const guardadas = localStorage.getItem(`pendientes_${usuario}`);
    return guardadas ? JSON.parse(guardadas) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      `favoritas_${usuario}`,
      JSON.stringify(favoritas)
    );
  }, [favoritas, usuario]);

  useEffect(() => {
    localStorage.setItem(
      `vistas_${usuario}`,
      JSON.stringify(vistas)
    );
  }, [vistas, usuario]);

  useEffect(() => {
    localStorage.setItem(
      `pendientes_${usuario}`,
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
