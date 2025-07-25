import React from 'react';
import { useLocation } from 'react-router-dom';
import MovieForm from '../components/MovieForm';
import { createMovie } from '../api/movies';

function AddMoviePage() {
  const location = useLocation();
  const prefill = location.state?.prefill;

  const initialData = prefill
    ? {
        title: prefill.Title,
        description: '',
        poster_url: prefill.Poster !== 'N/A' ? prefill.Poster : '',
        genre: prefill.Type || '',
      }
    : {};

  const handleSubmit = async (data) => {
    await createMovie(data);
    alert('Фільм додано!');
  };

  return (
    <div>
      <h2>Додати фільм</h2>
      <MovieForm initialData={initialData} onSubmit={handleSubmit} />
    </div>
  );
}

export default AddMoviePage;
