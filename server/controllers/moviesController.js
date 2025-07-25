import pool from '../db.js';

const API_KEY = 'ea9d248d';

export async function getMovies(req, res) {
  const { genre, search, sort, source } = req.query;

  if (!search && source === 'omdb') {
    return res.status(400).json({ error: 'Параметр search обов’язковий для OMDb пошуку' });
  }

  try {
    if (source === 'omdb') {
      const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(search)}&type=movie`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.Response === 'False') {
        return res.json([]);
      }

      const movies = data.Search.map(m => ({
        id: null,
        title: m.Title,
        poster_url: m.Poster !== 'N/A' ? m.Poster : null,
        year: m.Year,
        imdbid: m.imdbID,
        genre: [],
        average_rating: null,
      }));

      return res.json(movies);
    }

    const params = [];
    const conditions = [];
    let query = 'SELECT *, ROUND(average_rating::numeric, 2) AS average_rating_rounded FROM movies';

    if (genre) {
      params.push(genre);
      conditions.push(`$${params.length} = ANY(genre)`);
    }
    if (search) {
      params.push(`%${search}%`);
      conditions.push(`title ILIKE $${params.length}`);
    }
    if (conditions.length) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    if (sort === 'title') {
      query += ' ORDER BY title ASC';
    } else if (sort === 'rating') {
      query += ' ORDER BY average_rating DESC NULLS LAST';
    } else {
      query += ' ORDER BY id ASC';
    }

    const result = await pool.query(query, params);

    if (source === 'all') {
      if (!search) return res.json(result.rows);

      const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(search)}&type=movie`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.Response === 'True') {
        const omdbMovies = data.Search.map(m => ({
          id: null,
          title: m.Title,
          poster_url: m.Poster !== 'N/A' ? m.Poster : null,
          year: m.Year,
          imdbid: m.imdbID,
          genre: [],
          average_rating: null,
        }));

        const combined = [...result.rows];
        const existingImdbIds = new Set(result.rows.map(m => m.imdbid).filter(Boolean));
        for (const m of omdbMovies) {
          if (!existingImdbIds.has(m.imdbid)) combined.push(m);
        }
        return res.json(combined);
      }
    }

    return res.json(result.rows);
  } catch (err) {
    console.error('Error getMovies:', err);
    res.status(500).json({ error: 'Не вдалося завантажити фільми' });
  }
}

export async function getMovieById(req, res) {
  try {
    const result = await pool.query('SELECT * FROM movies WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Фільм не знайдено' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error getMovieById:', err);
    res.status(500).json({ error: 'Не вдалося завантажити фільм' });
  }
}

export async function createMovie(req, res) {
  try {
    const { title, description, genre, poster_url, year, imdbid } = req.body;
    const genresArray = Array.isArray(genre) ? genre : genre ? [genre] : [];

    const q = `
      INSERT INTO movies (title, description, genre, poster_url, average_rating, imdbid, year)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      title,
      description || null,
      genresArray,
      poster_url || null,
      0,
      imdbid || null,
      year || null
    ];

    const result = await pool.query(q, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error createMovie:', err);
    res.status(500).json({ error: 'Не вдалося створити фільм' });
  }
}

export async function updateMovie(req, res) {
  try {
    const { title, description, genre, poster_url, year } = req.body;
    const genresArray = Array.isArray(genre) ? genre : genre ? [genre] : [];

    const q = `
      UPDATE movies SET title=$1, description=$2, genre=$3, poster_url=$4, year=$5
      WHERE id=$6 RETURNING *
    `;

    const values = [
      title,
      description || null,
      genresArray,
      poster_url || null,
      year || null,
      req.params.id
    ];

    const result = await pool.query(q, values);
    if (!result.rows.length) return res.status(404).json({ error: 'Фільм не знайдено' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updateMovie:', err);
    res.status(500).json({ error: 'Не вдалося оновити фільм' });
  }
}

export async function deleteMovie(req, res) {
  try {
    const result = await pool.query('DELETE FROM movies WHERE id = $1', [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ error: 'Фільм не знайдено' });
    res.json({ message: 'Фільм видалено' });
  } catch (err) {
    console.error('Error deleteMovie:', err);
    res.status(500).json({ error: 'Не вдалося видалити фільм' });
  }
}

export async function addRating(req, res) {
  try {
    const { rating } = req.body;
    const movieId = req.params.id;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Некоректний рейтинг' });
    }

    await pool.query('INSERT INTO ratings (movie_id, rating) VALUES ($1, $2)', [movieId, rating]);

    const avgRes = await pool.query('SELECT AVG(rating) AS average_rating FROM ratings WHERE movie_id = $1', [movieId]);
    const avg = parseFloat(avgRes.rows[0].average_rating || 0).toFixed(2);

    await pool.query('UPDATE movies SET average_rating = $1 WHERE id = $2', [avg, movieId]);

    res.json({ average_rating: parseFloat(avg) });
  } catch (err) {
    console.error('Error addRating:', err);
    res.status(500).json({ error: 'Не вдалося додати рейтинг' });
  }
}

export async function importMovie(req, res) {
  try {
    const { imdbid } = req.body;
    if (!imdbid) return res.status(400).json({ error: 'imdbid is required' });

    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbid}`);
    const data = await response.json();

    if (data.Response !== 'True') {
      return res.status(404).json({ error: 'Фільм не знайдено в OMDb' });
    }

    const exists = await pool.query('SELECT 1 FROM movies WHERE imdbid = $1', [imdbid]);
    if (exists.rows.length) {
      return res.status(409).json({ error: 'Фільм уже доданий' });
    }

    const genresArray = data.Genre ? data.Genre.split(',').map(g => g.trim()) : [];

    const q = `
      INSERT INTO movies (title, description, genre, poster_url, average_rating, imdbid, year)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      data.Title,
      data.Plot === 'N/A' ? null : data.Plot,
      genresArray,
      data.Poster !== 'N/A' ? data.Poster : null,
      0,
      imdbid,
      data.Year
    ];

    const result = await pool.query(q, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error importMovie:', err);
    res.status(500).json({ error: 'Не вдалося імпортувати фільм' });
  }
}
