import express from 'express';
import cors from 'cors';
import moviesRoutes from './routes/moviesRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/movies', moviesRoutes);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
