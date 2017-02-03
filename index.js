const constants = require('./constants');
const RestConstructor = require('./rest-driver');
const DbConstructor = require('./db-filesystem');
const Server = require('./server');
const commandLineArgs = require('command-line-args');
const getUsage = require('command-line-usage');

const optionDefinitions = [
  { name: 'host', alias: 'n', type: String, defaultValue: '127.0.0.1' },
  { name: 'port', alias: 'p', type: Number, defaultValue: constants.DEFAULT_PORT },
  { name: 'help', alias: 'h' },
];

const options = commandLineArgs(optionDefinitions);
const db = DbConstructor(constants.DATA_FOLDER);
const rest = RestConstructor(db);

if (options.host === null || options.port < 0 || options.port > 65535) {
  console.log('Command line error. See usage below.');
  console.log(getUsage([{
    header: 'usage',
    optionList: optionDefinitions,
  }]));
  process.exit(1);
}

if (options.hasOwnProperty('help')) {
  console.log(getUsage([{
    header: 'usage',
    optionList: optionDefinitions,
  }]));
  process.exit(0);
}

const server = Server(db, rest);
server.listen(options.host, options.port);
