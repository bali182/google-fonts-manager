'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.urls = urls;
exports.downloadVariantsTtf = downloadVariantsTtf;
exports.download = download;

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _convert = require('./convert');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function streamToBufferPromise(stream) {
  return new _bluebird2.default(function (resolve, reject) {
    var buffer = [];
    stream.on('data', function (data) {
      return buffer.push(data);
    });
    stream.on('error', function (error) {
      return reject(error);
    });
    stream.on('end', function () {
      return resolve(Buffer.concat(buffer));
    });
  });
}

function downloadFile(url) {
  return (0, _nodeFetch2.default)(url).then(function (data) {
    return data.body;
  }).then(streamToBufferPromise);
}

function urls(font, variants) {
  var vars = variants.map(function (variant) {
    return variant.toString();
  });
  var keys = Object.keys(font.files).filter(function (key) {
    return vars.indexOf(key) >= 0;
  });
  return keys.map(function (key) {
    return [key, font.files[key]];
  });
}

function downloadVariantsTtf(font, variants) {
  var downloads = _bluebird2.default.all(urls(font, variants).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2);

    var variant = _ref2[0];
    var url = _ref2[1];
    return downloadFile(url).then(function (buffer) {
      return [variant, buffer];
    });
  }));
  return downloads.then(function (pairs) {
    return pairs.reduce(function (data, _ref3) {
      var _ref4 = _slicedToArray(_ref3, 2);

      var variant = _ref4[0];
      var buffer = _ref4[1];

      data[variant] = buffer;
      return data;
    }, {});
  });
}

function download(font, variants, formats) {
  return downloadVariantsTtf(font, variants).then(function (ttfData) {
    return (0, _convert.convert)(ttfData, formats).then(function (data) {
      return (0, _lodash.omit)(data, (0, _lodash.difference)(Object.keys(data), formats));
    }).then(function (data) {
      return (0, _lodash.assign)({}, font, { data: data });
    });
  });
}