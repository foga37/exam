import React, { useState, useEffect } from 'react';
import { fetchMovies } from '../api/movies.js';
import FilterForm from '../components/FilterForm.jsx';
import MovieCard from '../components/MovieCard.jsx';

function HomePage() {
  const [movies, setMovies] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    sort: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadMovies = async (params = {}) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchMovies(params);
      setMovies(data);
    } catch (e) {
      setError(e.message || 'Помилка при завантаженні фільмів');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies(filters);
  }, [filters]);

  const handleFilterSubmit = (values) => {
    setFilters(values);
  };

  return (
    <div>
      <h1>Кінобаза</h1>

      <FilterForm
        genre={filters.genre}
        search={filters.search}
        sort={filters.sort}
        onSubmit={handleFilterSubmit}
      />

      {loading && <p>Завантаження...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="row">
        {movies.length === 0 && !loading && <p>Фільми не знайдені</p>}

        {movies.map((movie) => (
          <div key={movie.id || movie.imdbid} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <MovieCard
              movie={movie}
              onDelete={(deletedId) => setMovies(prev => prev.filter(m => m.id !== deletedId))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
