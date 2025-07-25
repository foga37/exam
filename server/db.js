import pg from 'pg';

const pool = new pg.Pool({
  user: 'postgres',       // заміни на свого користувача
  password: 'postgres',   // заміни на свій пароль
  host: 'localhost',
  port: 5432,
  database: 'kinobaza',
});

export default pool;
