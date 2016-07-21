'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.write = write;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _dashify = require('dashify');

var _dashify2 = _interopRequireDefault(_dashify);

var _mkpath = require('mkpath');

var _mkpath2 = _interopRequireDefault(_mkpath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var writeFile = _bluebird2.default.promisify(_fs2.default.writeFile);
var mkpath = _bluebird2.default.promisify(_mkpath2.default);

function calculateFullPath(font, dir, variant, extension) {
  return _path2.default.join(dir, (0, _dashify2.default)(font.family), variant, (0, _dashify2.default)(font.family) + '-' + variant + '.' + extension);
}

function write(font, outputDir) {
  var writePromises = [];
  Object.keys(font.data).forEach(function (extension) {
    var variantToBufferMap = font.data[extension];
    Object.keys(variantToBufferMap).forEach(function (variant) {
      var buffer = variantToBufferMap[variant];
      var fullPath = calculateFullPath(font, outputDir, variant, extension);
      var promise = mkpath(_path2.default.dirname(fullPath)).then(function (_) {
        return writeFile(fullPath, buffer);
      });
      writePromises.push(promise);
    });
  });
  return _bluebird2.default.all(writePromises);
}