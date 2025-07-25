const API_KEY = 'ea9d248d';

export async function searchMovies(query) {
  const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`);
  const data = await response.json();

  if (data.Response === 'True') {
    return data.Search;
  } else {
    let errorMessage = data.Error || 'Фільми не знайдено';
    if (errorMessage === 'Too many results.') {
      errorMessage = 'Введіть на англійській мові назву фільма.';
    } else if (errorMessage === 'Movie not found!' || errorMessage === 'Movie not found') {
      errorMessage = 'Фільм не знайдено!';
    throw new Error(errorMessage);
  }
}
}

export async function getMovieById(imdbID) {
  const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`);
  const data = await response.json();

  if (data.Response === 'True') {
    return data;
  } else {
    throw new Error(data.Error || 'Фільм не знайдено');
  }
}
