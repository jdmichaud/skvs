const lodash = require('lodash');

function RestDriver(database) {
  return {
    list: function list(resource, query, res) {
      res.send(database.filter(resource, query));
    },

    create: function create(resource, data, query, res) {
      res.send(database.create(resource, data));
    },

    retrieve: function retrieve(resource, id, query, res) {
      res.send(database.get(resource, parseInt(id, 10)));
    },

    update: function update(resource, id, data, query, res) {
      const result = database.update(resource, id, data);
      if (lodash.isEmpty(result)) {
        res.status(404).send('Not found');
      }
      res.send(result);
    },

    del: function del(resource, id, res) {
      res.send(database.del(resource, parseInt(id, 10)));
    },
  };
}

module.exports = RestDriver;
