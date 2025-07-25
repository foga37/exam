const BASE_URL = '/api/movies';

export async function fetchMovies({ search, genre, sort, source = 'local' }) {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (genre) params.append('genre', genre);
  if (sort) params.append('sort', sort);
  if (source) params.append('source', source);

  const res = await fetch(`/api/movies?${params.toString()}`);
  if (!res.ok) throw new Error('Не вдалося завантажити фільми');
  return res.json();
}

export async function fetchMovie(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Не вдалося завантажити фільм');
  return res.json();
}

export async function createMovie(movieData) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movieData),
  });
  if (!res.ok) throw new Error('Не вдалося додати фільм');
  return res.json();
}

export async function updateMovie(id, movieData) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movieData),
  });
  if (!res.ok) throw new Error('Не вдалося оновити фільм');
  return res.json();
}

export async function deleteMovie(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Не вдалося видалити фільм');
  return res.json();
}

export async function addRating(movieId, rating) {
  const res = await fetch(`${BASE_URL}/${movieId}/ratings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating }),
  });
  if (!res.ok) throw new Error('Не вдалося додати рейтинг');
  const data = await res.json();

  return data.average_rating;
}
