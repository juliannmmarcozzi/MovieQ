import { useEffect, useState } from 'react';

type Resultado<T> = { clave: string; datos: T | null; error: string };

export function useSolicitud<T>(
  clave: string,
  cargar: (signal: AbortSignal) => Promise<T>,
  demora = 0
) {
  const [resultado, setResultado] = useState<Resultado<T> | null>(null);

  useEffect(() => {
    const controlador = new AbortController();

    const temporizador = window.setTimeout(() => {
      cargar(controlador.signal)
        .then((datos) => {
          if (!controlador.signal.aborted) {
            setResultado({ clave, datos, error: '' });
          }
        })
        .catch((error: unknown) => {
          if (!controlador.signal.aborted) {
            setResultado({
              clave,
              datos: null,
              error: error instanceof Error ? error.message : 'Ocurrió un error.',
            });
          }
        });
    }, demora);

    return () => {
      window.clearTimeout(temporizador);
      controlador.abort();
    };
  }, [clave, cargar, demora]);

  return {
    datos: resultado?.clave === clave ? resultado.datos : null,
    error: resultado?.clave === clave ? resultado.error : '',
    cargando: resultado?.clave !== clave,
  };
}
