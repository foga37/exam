import pool from '../db.js'; // підключення до PostgreSQL через pg Pool

export async function getMovies({ genre, search, sort }) {
  let query = 'SELECT *, ROUND(average_rating::numeric, 2) AS average_rating FROM movies';
  const params = [];
  const conditions = [];

  if (genre) {
    params.push(genre);
    conditions.push(`$${params.length} = ANY(genre)`);  // Ось сюди вставляємо
  }

  if (search) {
    params.push(`%${search}%`);
    conditions.push(`title ILIKE $${params.length}`);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  if (sort) {
    if (sort === 'title') {
      query += ' ORDER BY title ASC';
    } else if (sort === 'rating') {
      query += ' ORDER BY average_rating DESC NULLS LAST';
    }
  } else {
    query += ' ORDER BY id ASC';
  }

  const { rows } = await pool.query(query, params);
  return rows;
}


export async function getMovieById(id) {
  const { rows } = await pool.query('SELECT * FROM movies WHERE id = $1', [id]);
  return rows[0];
}

export async function createMovie(data) {
  const { title, description, genre, poster_url } = data;
  const { rows } = await pool.query(
    `INSERT INTO movies (title, description, genre, poster_url) VALUES ($1, $2, $3, $4) RETURNING *`,
    [title, description, genre, poster_url]
  );
  return rows[0];
}

export async function updateMovie(id, data) {
  const { title, description, genre, poster_url } = data;
  const { rows } = await pool.query(
    `UPDATE movies SET title = $1, description = $2, genre = $3, poster_url = $4 WHERE id = $5 RETURNING *`,
    [title, description, genre, poster_url, id]
  );
  return rows[0];
}

export async function deleteMovie(id) {
  const res = await pool.query('DELETE FROM movies WHERE id = $1', [id]);
  return res.rowCount > 0;
}

export async function addRating(movieId, rating) {
  // Припустимо, є таблиця ratings(movie_id, rating)
  await pool.query(
    `INSERT INTO ratings (movie_id, rating) VALUES ($1, $2)`,
    [movieId, rating]
  );

  // Обчислити середній рейтинг для фільму
  const { rows } = await pool.query(
    `SELECT AVG(rating) AS average_rating FROM ratings WHERE movie_id = $1`,
    [movieId]
  );

  const avg = parseFloat(rows[0].average_rating).toFixed(2);

  // Оновити середній рейтинг у таблиці movies
  await pool.query(
    `UPDATE movies SET average_rating = $1 WHERE id = $2`,
    [avg, movieId]
  );

  return parseFloat(avg);
}
