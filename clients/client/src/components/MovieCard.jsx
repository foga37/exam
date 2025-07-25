import { deleteMovie } from '../api/movies';
import React from 'react';
import { Link } from 'react-router-dom';
import './MovieCard.css';  // Імпорт стилів

function MovieCard({ movie, onDelete }) {
  const handleDelete = async () => {
    if (!movie.id) return;
    if (!window.confirm(`Ви впевнені, що хочете видалити "${movie.title}"?`)) return;

    try {
      await deleteMovie(movie.id);
      alert('Фільм видалено');
      if (onDelete) onDelete(movie.id);
    } catch (e) {
      alert('Не вдалося видалити фільм');
      console.error(e);
    }
  };

  return (
    <div className="card h-100 shadow-sm movie-card">
      <Link to={`/movies/${movie.id}`} className="text-decoration-none text-dark">
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="card-img-top"
          style={{ height: '225px', objectFit: 'cover' }}
          onError={(e) => { e.target.src = '/missing-poster.jpg'; }}
        />
        <div className="card-body d-flex flex-column p-3">
          <h5 className="card-title mb-2" style={{ fontSize: '1.1rem' }}>{movie.title}</h5>
          <p className="card-text mb-1 text-muted" style={{ fontSize: '0.9rem' }}>Жанр: {movie.genre}</p>
          <p className="card-text mb-0" style={{ fontSize: '0.9rem' }}>Рейтинг: {movie.average_rating || 'Немає'}</p>
          <div className="mt-auto"></div>
        </div>
      </Link>

      {movie.id && (
        <button
          onClick={handleDelete}
          className="btn btn-danger btn-sm m-3"
          style={{ width: 'calc(100% - 24px)' }}
        >
          Видалити
        </button>
      )}
    </div>
  );
}

export default MovieCard;
