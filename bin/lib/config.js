'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configFileName = configFileName;
exports.configFilePath = configFilePath;
exports.defaultConfig = defaultConfig;
exports.config = config;
exports.writeConfig = writeConfig;
exports.createConfig = createConfig;
exports.configExists = configExists;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var readFile = _bluebird2.default.promisify(_fs2.default.readFile);
var writeFile = _bluebird2.default.promisify(_fs2.default.writeFile);
var stat = _bluebird2.default.promisify(_fs2.default.stat);

function configFileName() {
  return 'google-fonts.json';
}

function configFilePath() {
  return _path2.default.join(process.cwd(), configFileName());
}

function defaultConfig() {
  return {
    fonts: [],
    formats: ['ttf', 'woff', 'woff2'],
    output: 'fonts'
  };
}

function config() {
  return readFile(configFilePath(), 'utf-8').then(function (data) {
    return JSON.parse(data);
  });
}

function writeConfig(config) {
  return writeFile(configFilePath(), JSON.stringify(config, null, 2), 'utf-8');
}

function createConfig() {
  return writeConfig(defaultConfig());
}

function configExists() {
  return stat(configFilePath()).then(function (_) {
    return true;
  }).catch(function (error) {
    if (error.code === 'ENOENT') {
      return _bluebird2.default.resolve(false);
    } else {
      throw error;
    }
  });
}