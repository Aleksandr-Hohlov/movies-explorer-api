require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, NODE_ENV, MONGO = 'mongodb://127.0.0.1:27017/moviesdb' } = process.env;
const app = express();
mongoose.connect(NODE_ENV === 'production' ? MONGO : 'mongodb://127.0.0.1:27017/moviesdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors);

const routes = require('./routes/routes');
const handleErrors = require('./middlewares/handleErrors');

app.use(requestLogger); // подключаем логгер запросов за ним идут все обработчики роутов

app.use(routes);

app.use(errorLogger); // нужно подключить после обработчиков роутов и до обработчиков ошибок
app.use(errors());
app.use(handleErrors);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});

/*
{
  "email": "asd755@yandex.ru",
  "password": "asd755@yandex.ru",
  "name": "asd755",
}
{
data: { asd755@yandex.ru, asd755@yandex.ru }
}

,

ssh aleks123@51.250.85.114
http://api.movies-Hohlov.nomoredomains.club
api.movies-Hohlov.nomoredomains.club
69c9b2e92a586e3c693fee194130235a111e68941c5896d14c3f93cea01fbb37

chmod +x /home/aleks123/movies-explorer-api/frontend/build
root /home/aleks123/movies-explorer-api/frontend/build
sudo chown -R $USER:www-data /home/aleks123/movies-explorer-api/frontend/build
scp -r ./build/* aleks123@51.250.85.114 /home/aleks123/movies-explorer-api/frontend/build
scp ./.nojekyll aleks123@51.250.85.114:/home/aleks123/backend
scp -r ./build/* aleks123@51.250.85.114:/home/aleks123/backend

sudo nano /etc/nginx/sites-available/default
sudo nano /etc/nginx/nginx.conf
sudo nano ./.env
sudo nano ./app.js
sudo nano ./middlewares/cors.js

scp -r ./* aleks123@51.250.85.114:/home/aleks123/movies-explorer-api/backend
scp -r ./build/* aleks123@51.250.85.114:/home/aleks123/movies-explorer-api/backend
sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/enabled
sudo certbot install --cert-name mesto-avtor-HohlovAleks.nomoredomains.club --nginx

*/
