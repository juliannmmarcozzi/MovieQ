export default function Creditos() {
  return (
    <footer className="bg-[#10182D] border-t border-white/10 text-gray-300 text-xs">
      <div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap items-center gap-4">
        <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">
          <img
            src="https://www.themoviedb.org/assets/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
            alt="TMDB"
            className="w-20"
          />
        </a>
        <div>
          <p>Créditos: The Movie Database (TMDB).</p>
          <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
        </div>
      </div>
    </footer>
  );
}
