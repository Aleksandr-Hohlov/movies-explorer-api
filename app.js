require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/moviesdb');

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors);

const NotFoundError = require('./errors/NotFoundError');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const { loginUser, createUser } = require('./controllers/users');
const { messageErr } = require('./constants/constants');
const handleErrors = require('./middlewares/handleErrors');
const auth = require('./middlewares/auth');
const { createUserValidation, loginValidation } = require('./middlewares/validation');

app.use(requestLogger); // подключаем логгер запросов за ним идут все обработчики роутов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', loginValidation, loginUser);
app.post('/signup', createUserValidation, createUser);
app.use(auth);
app.use('/movies', movieRouter);
app.use('/users', userRouter);

app.use('*', () => {
  throw new NotFoundError(messageErr.notFound.page);
});

app.use(errorLogger); // нужно подключить после обработчиков роутов и до обработчиков ошибок
app.use(errors());
app.use(handleErrors);

app.listen(PORT);
