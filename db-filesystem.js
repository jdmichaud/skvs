const fs = require('fs');
const path = require('path');
const lodash = require('lodash');

const constants = Object.freeze({
  DELETE_MARK: '_deleted_',
});

const idRegex = new RegExp('^[0-9]*$');

function mkdirSync(dirpath) {
  try {
    fs.mkdirSync(dirpath);
  } catch (e) {
    if (e.code !== 'EEXIST') throw e;
  }
}

function mkdirpSync(dirpath) {
  const parts = dirpath.split(path.sep);
  const format = path.parse(dirpath);
  for (var i = 1; i <= parts.length; i += 1) {
    mkdirSync(path.join.apply(null, [format.root].concat(parts.slice(0, i))));
  }
}

function timestamp() {
  return new Date().toISOString();
}

function getLastEntryInDir(pathWithId) {
  return fs.readdirSync(pathWithId)
    .concat()
    .sort((lhs, rhs) =>
      Date.parse(lhs.slice(lhs.indexOf('_') + 1)) > Date.parse(rhs.slice(rhs.indexOf('_') + 1)))
    .pop();
}

function getItemFromPath(dirpath) {
  try {
    const filename = getLastEntryInDir(dirpath);
    return JSON.parse(fs.readFileSync(path.join(dirpath, filename)));
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
  return {};
}

function Db(rootPath) {
  if (lodash.isUndefined(rootPath)) {
    rootPath = path.join(process.cwd(), 'db');
  }
  return {
    filter: function (resource, query) {
      function filterall() {
        const filepath = path.join(rootPath, resource);
        const filenames = fs.readdirSync(filepath)
          // Filter out the deleted items
          .filter(idfolder => idRegex.test(idfolder))
          // Get the last updated file in the folder
          .map(idfolder => path.join(idfolder, getLastEntryInDir(path.join(filepath, idfolder))));
        return filenames
          .map(filename =>
            JSON.parse(fs.readFileSync(path.join(filepath, filename))));
      }
      const all = filterall();
      if (lodash.isUndefined(query) || lodash.isEmpty(query)) {
        return all;
      }
      return all.filter(item =>
        Object.keys(query).reduce((accumulator, property) =>
          accumulator &&
          item.hasOwnProperty(property) &&
          lodash.isEqual(query[property], item[property]),
          true)
      );
    },
    get: function (resource, id) {
      const filepath = path.join(rootPath, resource, String(id));
      return getItemFromPath(filepath);
    },
    create: function (resource, data) {
      const filepath = path.join(rootPath, resource);
      mkdirpSync(filepath);
      const pathWithIds = fs.readdirSync(filepath)
        .filter(id => idRegex.test(id))
        .map(id => parseInt(id, 10));
      let maxid = Math.max.apply({}, pathWithIds);
      maxid = maxid > 0 ? maxid : 0;
      data.id = maxid + 1;
      mkdirpSync(path.join(filepath, String(data.id)));
      fs.writeFileSync(path.join(filepath, String(data.id), `${resource}_${timestamp()}`),
                       JSON.stringify(data));
      return data;
    },
    update: function (resource, id, data) {
      const filepath = path.join(rootPath, resource, String(id));
      const item = getItemFromPath(filepath);
      lodash.merge(item, data);
      fs.writeFileSync(path.join(filepath, `${resource}_${timestamp()}`),
                       JSON.stringify(item));
      return item;
    },
    del: function (resource, id) {
      const filepath = path.join(rootPath, resource, String(id));
      const item = getItemFromPath(filepath);
      if (!lodash.isEmpty(item)) {
        try {
          const delname = `${filepath}${constants.DELETE_MARK}${timestamp()}`;
          fs.renameSync(filepath, delname);
        } catch (e) {
          console.log(e);
        }
      }
      return (item);
    },
  };
}

module.exports = Db;

// var db = require('./db-filesystem')('/tmp/data');
// db.create('door-switches', '{"open":true}');
// db.get('door-switches')
// db.update('door-switches', 2, '{"open":true}');
