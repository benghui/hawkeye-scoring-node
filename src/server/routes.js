module.exports = (app, db) => {
  app.get('/api', app.get);
};
