const router = require('express').Router();
const { createUserValidation, loginValidation } = require('../middlewares/validation');
const { createUser, loginUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const userRouter = require('./users');
const movieRouter = require('./movies');
const { messageErr } = require('../constants/constants');

// запуск роутеров без авторизации
router.post('/signin', loginValidation, loginUser);
router.post('/signup', createUserValidation, createUser);

// защита авторизацией
router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('*', () => {
  throw new NotFoundError(messageErr.notFound.page);
});

module.exports = router;
