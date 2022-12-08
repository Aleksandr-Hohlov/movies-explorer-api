const router = require('express').Router();
const { createMovieValidation, movieIdValidate } = require('../middlewares/validation');
const { getAllMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/', getAllMovies);
router.post('/', createMovieValidation, createMovie);
router.delete('/:movieId', movieIdValidate, deleteMovie);

module.exports = router;
