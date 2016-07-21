'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.toSvg = toSvg;
exports.toWoff = toWoff;
exports.toEot = toEot;
exports.convert = convert;

var _ttf2svg = require('ttf2svg');

var _ttf2svg2 = _interopRequireDefault(_ttf2svg);

var _ttf2woff = require('ttf2woff');

var _ttf2woff2 = _interopRequireDefault(_ttf2woff);

var _ttf2eot = require('ttf2eot');

var _ttf2eot2 = _interopRequireDefault(_ttf2eot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toSvg(ttfBuffer) {
  return Promise.resolve((0, _ttf2svg2.default)(ttfBuffer));
}

function toWoff(ttfBuffer) {
  return Promise.resolve(new Buffer((0, _ttf2woff2.default)(new Uint8Array(ttfBuffer)).buffer));
}

function toEot(ttfBuffer) {
  return Promise.resolve(new Buffer((0, _ttf2eot2.default)(new Uint8Array(ttfBuffer)).buffer));
}

function convertInternal(data, converter) {
  var convertPromises = Object.keys(data).map(function (key) {
    return [key, data[key]];
  }).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2);

    var key = _ref2[0];
    var buffer = _ref2[1];

    return converter(buffer).then(function (cnv) {
      return [key, cnv];
    });
  });
  return Promise.all(convertPromises).then(function (converted) {
    return converted.reduce(function (output, _ref3) {
      var _ref4 = _slicedToArray(_ref3, 2);

      var key = _ref4[0];
      var bfr = _ref4[1];

      output[key] = bfr;
      return output;
    }, {});
  });
}

var converters = {
  svg: toSvg,
  woff: toWoff,
  eot: toEot
};

function convert(ttfData, formats) {
  var convertPromises = formats.filter(function (format) {
    return format !== 'ttf';
  }).map(function (format) {
    var converter = converters[format];
    if (!converter) {
      return Promise.reject(new Error('Unknown format ' + format));
    }
    return convertInternal(ttfData, converter).then(function (data) {
      return [format, data];
    });
  });
  return Promise.all(convertPromises).then(function (data) {
    return data.reduce(function (output, _ref5) {
      var _ref6 = _slicedToArray(_ref5, 2);

      var format = _ref6[0];
      var buffers = _ref6[1];

      output[format] = buffers;
      return output;
    }, { ttf: ttfData });
  });
}