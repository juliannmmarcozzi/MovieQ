
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

type AuthContextType = {
  usuario: string | null;
  iniciarSesion: (nombreUsuario: string) => void;
  cerrarSesion: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<string | null>(() => {
    return localStorage.getItem('usuarioActual');
  });

  function iniciarSesion(nombreUsuario: string) {
    localStorage.setItem('usuarioActual', nombreUsuario);
    setUsuario(nombreUsuario);
  }

  function cerrarSesion() {
    localStorage.removeItem('usuarioActual');
    setUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        iniciarSesion,
        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return context;
}
