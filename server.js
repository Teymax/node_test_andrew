import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import logger from './utils/logger';
import passport from 'passport';

require('dotenv').config();

const { DB_NAME } = process.env;
const app = express();
const models = require('./models');

// import user routes
const userRoutes = require('./routes/user.routes');


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

// register user routes
app.use('/user', userRoutes);

const port = process.env.PORT || 9000;

process.on('unhandledRejection', error => {
  logger.error(error.message);
});

// connect to database
models.sequelize.authenticate()
  .then(() => {
    logger.info(`Connected to database: ${DB_NAME}`)
  })
  .catch(err => {
    logger.error(`Unable to connect to SQL database: ${DB_NAME}`);
    logger.error(err.message);
  });
if (process.env.NODE_ENV === 'development') {
  models.sequelize.sync();
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.listen(port, () => {
  logger.info(`Server start on port ${port}`)
});

module.exports = app;
