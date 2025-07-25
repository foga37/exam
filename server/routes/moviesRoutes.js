import express from 'express';
import * as MoviesController from '../controllers/moviesController.js';

const router = express.Router();

router.get('/', MoviesController.getMovies);
router.get('/:id', MoviesController.getMovieById);
router.post('/', MoviesController.createMovie);
router.put('/:id', MoviesController.updateMovie);
router.delete('/:id', MoviesController.deleteMovie);
router.post('/:id/ratings', MoviesController.addRating);
router.post('/import', MoviesController.importMovie);

export default router;
