# MovieQ

Aplicación de películas hecha con React, TypeScript y Vite.

## Ejecutar el proyecto

1. Ejecutá `npm install`.
2. Creá una cuenta en [TMDB](https://www.themoviedb.org/) y solicitá acceso desde Configuración > API.
3. Copiá `.env.example` a `.env.local` y completá `VITE_TMDB_TOKEN` con el API Read Access Token (no la API Key corta).
4. Ejecutá `npm run dev`.

El catálogo, la búsqueda, los pósters, los detalles y las recomendaciones se obtienen de TMDB.
Las listas y las reseñas de MovieQ se guardan en localStorage. Las reseñas son por película y usuario, y se pueden editar o eliminar; solo se comparten entre cuentas del mismo navegador. No se envían a TMDB.

Las variables VITE_ forman parte del código que recibe el navegador. No se debe incluir el token en Git; para un despliegue que necesite protegerlo, usar un backend/proxy. El inicio de sesión actual también es local y no constituye autenticación segura para producción.

This product uses the TMDB API but is not endorsed or certified by TMDB.
