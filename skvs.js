#!/usr/bin/env node
const constants = require('./constants');
const RestConstructor = require('./rest-driver');
const FilesystemDbConstructor = require('./db-filesystem');
const MemoryDbConstructor = require('./db-filesystem');
const Server = require('./server');
const commandLineArgs = require('command-line-args');
const getUsage = require('command-line-usage');

const optionDefinitions = [
  { name: 'host', alias: 'n', type: String, defaultValue: '127.0.0.1' },
  { name: 'port', alias: 'p', type: Number, defaultValue: constants.DEFAULT_PORT },
  { name: 'storage', alias: 's', type: String },
  { name: 'prefix', alias: 'r', type: String, defaultValue: constants.REST_URL_PREFIX },
  { name: 'help', alias: 'h' },
];

const options = commandLineArgs(optionDefinitions);
if (options.host === null || options.port < 0 || options.port > 65535 || options.storage === null ||
  options.prefix === null) {
  console.log('Command line error. See usage below.');
  console.log(getUsage([{
    header: 'usage',
    optionList: optionDefinitions,
  }]));
  process.exit(1);
}
if (lodash.has(options, 'help')) {
  console.log(getUsage([{
    header: 'usage',
    optionList: optionDefinitions,
  }]));
  process.exit(0);
}

const db = options.storage ?
  FilesystemDbConstructor(options.storage) : MemoryDbConstructor();
const rest = RestConstructor(db);

const server = Server(db, rest, options.prefix);
server.listen(options);
