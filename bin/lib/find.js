'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.all = all;
exports.exploreByName = exploreByName;
exports.findByName = findByName;

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _dashify = require('dashify');

var _dashify2 = _interopRequireDefault(_dashify);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function all(apiKey) {
  return (0, _nodeFetch2.default)('https://www.googleapis.com/webfonts/v1/webfonts?key=' + apiKey).then(function (response) {
    return response.json();
  }).then(function (data) {
    if (data.error) {
      throw new Error(data.error.message);
    } else {
      return data.items;
    }
  });
}

function exploreByName(searchTerm, apiKey) {
  return all(apiKey).then(function (fonts) {
    return fonts.filter(function (font) {
      return (0, _lodash.includes)((0, _dashify2.default)(font.family), (0, _dashify2.default)(searchTerm || ''));
    });
  });
}

function findByName(name, apiKey) {
  return all(apiKey).then(function (fonts) {
    return (0, _lodash.find)(fonts, function (font) {
      return (0, _dashify2.default)(font.family) === (0, _dashify2.default)(name || '');
    });
  });
}