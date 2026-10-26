# MovieQ
Página web inspirada en IMDb para explorar películas, consultar su información y crear listas personales de películas favoritas, vistas o pendientes. Catálogo de películas cargadas local, con los pósters. la información, la sinopsis de la película, etc 

Pantallas

-Inicio: 
catálogo de películas organizadas en base a las más populares, las mejor valoradas y los últimos estrenos. Cada película va a tener su propio póster, título, año y puntuación.

-Buscador: 
buscar películas por nombre

-Detalle de película: 
mostrará sinopsis, duración, géneros, reparto y puntuación. También permitirá agregar películas a favoritos o marcarlas como vistas.

-Mi lista: 
sección para organizar películas favoritas, vistas y pendientes. Los cambios se guardarán en localStorage para que no desaparezcan al actualizar la página.



Contenidos

Para búsquedas de la home vamos a usar useState, vamos a usar map y componentes y props para las cards de las películas
TypeScript, Tailwind para el diseño y Context para las listas
De los opcionales vamos a usar useEffect para sincronizar los datos con localStorage.

Objetivo de la página

El objetivo de la página es crear una página de películas atractiva y funcional, con navegación entre distintas secciones y funcionalidades interactivas, aplicando los contenidos aprendidos en React y distribuyendo el trabajo entre dos personas.
map: recorre el catálogo y crea una card por película.
