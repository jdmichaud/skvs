const express = require('express');
const bodyParser = require('body-parser');
const lodash = require('lodash');
const constants = require('./constants');

const Server = function Server(db, rest) {
  const watcher = {};
  const urlRegex = RegExp(`/+${constants.REST_URL_PREFIX}/([^/?]+).*`);

  // Used to callback the client which requested a long polling
  // on the affected resource.
  function publish(resource) {
    if (watcher[resource]) {
      watcher[resource].forEach((res) => {
        // Trigger a list response on the waiting clients
        rest.list(resource, {}, res);
      });
      // Once watchers are called back, remove them from the waiting list
      watcher[resource].length = 0;
    }
  }

  // Create the Express application
  const app = express();
  app.disable('x-powered-by');
  app.use(bodyParser.json());

  // Define the application routes
  app.get(`/+${constants.REST_URL_PREFIX}/[^/]+/`, (req, res) => {
    const resource = urlRegex.exec(req.url)[1];
    if (req.query.hasOwnProperty('watch')) {
      watcher[resource] = watcher[resource] || [];
      watcher[resource].push(res);
    } else {
      console.log('req.query:', req.query);
      rest.list(resource, req.query, res);
    }
  });

  app.get(`/+${constants.REST_URL_PREFIX}/*/:id`, (req, res) => {
    const resource = urlRegex.exec(req.url)[1];
    rest.retrieve(resource, req.params.id, req.query, res);
  });

  app.post(`/+${constants.REST_URL_PREFIX}/[^/]+/`, (req, res) => {
    const resource = urlRegex.exec(req.url)[1];
    rest.create(resource, req.body, req.query, res);
    publish(resource);
  });

  app.post(`/+${constants.REST_URL_PREFIX}/*/:id`, (req, res) => {
    const resource = urlRegex.exec(req.url)[1];
    rest.update(resource, req.params.id, req.body, req.query, res);
    publish(resource);
  });

  app.delete(`/+${constants.REST_URL_PREFIX}/*/:id`, (req, res) => {
    const resource = urlRegex.exec(req.url)[1];
    rest.del(resource, req.params.id, res);
    publish(resource);
  });

  app.all('*', (req, res) => {
    res.status(404).send({ error: `Unknown URL ${req.url}` });
  });

  // Error handler
  app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    next(err);
  });
  app.use((err, req, res, next) => {
    res.status(500).send({ error: 'Server Error' });
  });
  return {
    listen: function listen(host, port) {
      app.listen(port, host, () =>
      console.log(`server listening on port ${host}:${port}`));
    },
  };
};

module.exports = Server;
