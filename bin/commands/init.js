'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _lodash = require('lodash');

var _config = require('../lib/config');

var _utils = require('../lib/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var questions = [{
  type: 'input',
  name: 'apiKey',
  message: 'Google fonts API key:',
  validate: function validate(input) {
    return input && input.length > 0;
  }
}, {
  type: 'input',
  name: 'output',
  default: 'fonts',
  message: 'Installation path:',
  validate: function validate(input) {
    return input && input.length > 0;
  }
}];

function init(options) {
  _inquirer2.default.prompt(questions).then(function (answers) {
    var newCfgData = {
      apiKey: answers.apiKey,
      output: answers.output,
      fonts: {}
    };
    return (0, _config.configExists)().then(function (exists) {
      if (exists) {
        return (0, _config.config)().then(function (cfg) {
          return (0, _config.writeConfig)((0, _lodash.merge)({}, cfg, newCfgData)).then(function (_) {
            return (0, _utils.success)('Config updated');
          });
        });
      } else {
        return (0, _config.writeConfig)(newCfgData).then(function (_) {
          return (0, _utils.success)('Config created');
        });
      }
    });
  });
}