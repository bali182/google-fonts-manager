'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logThen = exports.errorThen = exports.successThen = exports.error = exports.success = exports.NOK = exports.OK = undefined;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OK = exports.OK = '✔';
var NOK = exports.NOK = '✖';
var success = exports.success = function success(message) {
  return console.log(_chalk2.default.green(OK) + ' ' + message);
};
var error = exports.error = function error(message) {
  return console.log(_chalk2.default.red(NOK) + ' ' + message);
};

var successThen = exports.successThen = function successThen(message) {
  return function (result) {
    success(message);
    return result;
  };
};

var errorThen = exports.errorThen = function errorThen(message) {
  return function (result) {
    error(message);
    return result;
  };
};

var logThen = exports.logThen = function logThen(message) {
  return function (result) {
    console.log(message);
    return result;
  };
};