const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('express-async-errors');

const loginRouter = require('./controllers/login');
const userRouter = require('./controllers/user');
const postRouter = require('./controllers/post');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');

logger.info(`Connecting to ${config.MONGOURL}`);

mongoose.connect(config.MONGOURL)
  .then(() => {
    logger.info(`Connected to MongoDB`);
  })
  .catch((error) => {
    logger.error(`Error connecting to mongodb: `, error.message);
  })

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/login', loginRouter);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;