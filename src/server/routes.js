module.exports = (app, db) => {
  const query = require('./controllers/query')(db);

  app.get('/api/query', query.get);
};
