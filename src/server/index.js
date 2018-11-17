const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./logger');
// const pg = require('pg');
const db = require('./db');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.HTTP_PORT = process.env.HTTP_PORT || 3000;

function onUnhandledError(err) {
  try {
    logger.error(err);
  } catch (e) {
    console.log('LOGGER ERROR:', e);
    console.log('APPLICATION ERROR:', err);
  }
  process.exit(1);
}

process.on('unhandledRejection', onUnhandledError);
process.on('uncaughtException', onUnhandledError);

const setupAppRoutes =
  process.env.NODE_ENV === 'development' ? require('./middlewares/development') : require('./middlewares/production');

const app = express();

app.set('env', process.env.NODE_ENV);
logger.info(`Application env: ${process.env.NODE_ENV}`);

app.use(logger.expressMiddleware);
app.use(bodyParser.json());

require('./routes')(app, db);

// const config = {
//   user: 'benghui',
//   host: '127.0.0.1',
//   database: 'hawkeye-scoring',
//   port: 5432,
// };
// const pool = new pg.Pool(config);

// pool.on('error', (err) => {
//   console.log('Idle client error', err.message, err.stack);
// });

app.get('/', (request, response) => {
  const queryString = 'SELECT * FROM students';
  db.queryInterface(queryString, null, (error, queryResult) => {
    if (error) {
      console.error(error);
    } else {
      response.send('success');
    }
  });
});

// application routes (this goes last)
setupAppRoutes(app);

http.createServer(app).listen(process.env.HTTP_PORT, () => {
  logger.info(`HTTP server is now running on http://localhost:${process.env.HTTP_PORT}`);
});
