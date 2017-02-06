const express = require('express');
const bodyParser = require('body-parser');
const lodash = require('lodash');
const constants = require('./constants');

const Server = function Server(db, rest, prefix) {
  const watcher = {};
  const urlRegex = RegExp(`/+${prefix}/([^/?]+).*`);

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
  app.get(`/+${prefix}/[^/]+/`, (req, res) => {
    const resource = urlRegex.exec(req.url)[1];
    if (lodash.has(req.query, 'watch')) {
      watcher[resource] = watcher[resource] || [];
      watcher[resource].push(res);
    } else {
      rest.list(resource, req.query, res);
    }
  });

  app.get(`/+${prefix}/*/:id`, (req, res) => {
    const resource = urlRegex.exec(req.url)[1];
    rest.retrieve(resource, req.params.id, req.query, res);
  });

  app.post(`/+${prefix}/[^/]+/`, (req, res) => {
    const resource = urlRegex.exec(req.url)[1];
    rest.create(resource, req.body, req.query, res);
    publish(resource);
  });

  app.post(`/+${prefix}/*/:id`, (req, res) => {
    const resource = urlRegex.exec(req.url)[1];
    rest.update(resource, req.params.id, req.body, req.query, res);
    publish(resource);
  });

  app.delete(`/+${prefix}/*/:id`, (req, res) => {
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
    listen: function listen(options) {
      app.listen(options.port, options.host, () => {
        let prompt = 'server listening on';
        prompt += ` http://${options.host}:${options.port}/${options.prefix}`;
        if (options.storage) {
          prompt += ` using filesystem store on ${options.storage}`;
        } else {
          prompt += ' using memory store';
        }
        console.log(prompt);
      });
    },
  };
};

module.exports = Server;
