'use strict';

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _lodash = require('lodash');

var _init = require('./commands/init');

var _init2 = _interopRequireDefault(_init);

var _install = require('./commands/install');

var _install2 = _interopRequireDefault(_install);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var options = (0, _minimist2.default)(process.argv.slice(2));
var command = options['_'][0];
var input = options['_'].slice(1);
var args = (0, _lodash.omit)(options, ['_']);

switch (command) {
  case 'install':
    (0, _install2.default)(input, args);break;
  case 'init':
    (0, _init2.default)(input, args);break;
}