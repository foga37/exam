import React, { useEffect, useState } from 'react';
import { fetchMovie, addRating, deleteMovie } from '../api/movies.js';
import { useParams, useNavigate } from 'react-router-dom';
import RatingForm from '../components/RatingForm.jsx';

function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadMovie() {
      try {
        const data = await fetchMovie(id);
        setMovie(data);
        setError('');
      } catch {
        setError('Не вдалося завантажити фільм');
      }
    }
    if (id) {
      loadMovie();
    }
  }, [id]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!movie) return <p>Завантаження...</p>;

  const handleRatingSubmit = async ({ rating }) => {
    try {
      const average_rating = await addRating(id, rating);
      setMovie((prev) => ({ ...prev, average_rating }));
      alert('Рейтинг додано!');
    } catch (e) {
      alert('Не вдалося додати рейтинг');
      console.error(e);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Ви дійсно хочете видалити цей фільм?')) {
      try {
        await deleteMovie(id);
        alert('Фільм видалено!');
        navigate('/');
      } catch (e) {
        alert('Не вдалося видалити фільм');
        console.error(e);
      }
    }
  };

  return (
    <div>
      <h1>{movie.title}</h1>
      <img src={movie.poster_url} alt={movie.title} width={300} />
      <p>{movie.description}</p>
      <p>Жанр: {movie.genre}</p>
      <p>Середній рейтинг: {movie.average_rating || 'Немає'}</p>

      <h3>Оцініть фільм</h3>
      <RatingForm onSubmit={handleRatingSubmit} />

      <button
        onClick={handleDelete}
        style={{ marginTop: '20px', backgroundColor: 'red', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Видалити фільм
      </button>
    </div>
  );
}

export default MovieDetailPage;
