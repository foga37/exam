import React, { useState } from 'react';
import { searchMovies } from '../api/omdbApi.js';

function isValidPoster(url) {
  if (!url || url === 'N/A') return false;
  return /\.(jpg|jpeg|png|gif)$/i.test(url);
}

function OmdbSearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [noResults, setNoResults] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Введіть назву фільму для пошуку');
      setResults([]);
      setNoResults(false);
      return;
    }

    try {
      const movies = await searchMovies(query);

      if (!movies || !Array.isArray(movies) || movies.length === 0) {
        setResults([]);
        setError('');
        setNoResults(true);
        return;
      }

      const sanitizedMovies = movies.map(movie => ({
        ...movie,
        Poster: isValidPoster(movie.Poster) ? movie.Poster : '/missing-poster.jpg',
      }));

      setResults(sanitizedMovies);
      setError('');
      setNoResults(false);
    } catch (e) {
      setError('Помилка пошуку фільмів');
      setResults([]);
      setNoResults(false);
    }
  };

  return (
    <div className="mb-3">
      <div className="input-group">
        <input
          type="text"
          placeholder="Пошук фільмів...(англійською мовою)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="form-control"
        />
        <button onClick={handleSearch} className="btn btn-primary">
          Шукати
        </button>
      </div>

      {error && <div className="text-danger mt-2">{error}</div>}
      {noResults && <div className="text-warning mt-2">Фільми не знайдені</div>}

      <div className="row mt-3 gy-3">
        {results.map((movie) => (
          <div key={movie.imdbID} className="col-6 col-md-4 col-lg-3">
            <div
              className="card h-100 cursor-pointer"
              style={{ cursor: 'pointer' }}
              onClick={() => onSelect(movie)}
            >
              <img
                src={movie.Poster}
                alt={movie.Title}
                className="card-img-top"
                style={{ height: '200px', objectFit: 'cover' }}
                onError={(e) => {
                  console.error('Помилка 404 — це не помилка коду, а помилка завантаження картинки з серверу, тому показую "Відсутній постер".');
                  e.target.onerror = null; 
                  e.target.src = '/missing-poster.jpg'; 
                }}
              />
              <div className="card-body p-2">
                <h6 className="card-title mb-1">{movie.Title}</h6>
                <p className="card-text mb-0">Рік: {movie.Year}</p>
                <p className="card-text mb-0">Тип: {movie.Type}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OmdbSearch;
