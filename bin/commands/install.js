'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = install;

var _lodash = require('lodash');

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _download = require('../lib/download');

var _convert = require('../lib/convert');

var _find = require('../lib/find');

var _write = require('../lib/write');

var _config = require('../lib/config');

var _utils = require('../lib/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var variantMapping = {
  '100': 'hairline',
  '200': 'extra light',
  '300': 'light',
  '400': 'regular',
  '500': 'medium',
  '600': 'semi bold',
  '700': 'bold',
  '800': 'extra bold',
  '900': 'heavy'
};

function variantName(variant) {
  if (variantMapping[variant]) {
    return '' + variantMapping[variant];
  } else {
    var baseVariant = (0, _lodash.find)(Object.keys(variantMapping), function (key) {
      return (0, _lodash.startsWith)(variant, key);
    });
    if (baseVariant) {
      var extra = variant.replace(baseVariant, '');
      return variantMapping[baseVariant] + ' ' + extra;
    }
  }
  return variant;
}

function variantsQuestion(variants) {
  return {
    type: 'checkbox',
    name: 'variants',
    message: 'Variants:',
    default: ['regular', '400'],
    choices: variants.map(function (variant) {
      return { name: variantName(variant), value: variant };
    }).sort(function (a, b) {
      return a.value.localeCompare(b.value);
    })
  };
}

function questions(font) {
  return [variantsQuestion(font.variants), {
    type: 'checkbox',
    name: 'formats',
    message: 'Formats:',
    default: ['ttf', 'woff', 'eot', 'svg'],
    choices: [{ name: 'ttf', value: 'ttf' }, { name: 'woff', value: 'woff' }, { name: 'eot', value: 'eot' }, { name: 'svg', value: 'svg' }, { name: 'woff2 (work in progress)', value: 'woff2' }]
  }, {
    type: 'confirm',
    message: 'Save to ' + (0, _config.configFileName)(),
    name: 'save',
    default: true
  }];
}

function installFont(font, variants, formats, save, cfg) {
  var installPromise = (0, _download.download)(font, variants, formats).then(function (font) {
    return (0, _write.write)(font, cfg.output || 'fonts');
  });
  if (save) {
    installPromise = installPromise.then(function (_) {
      return (0, _config.writeConfig)((0, _lodash.merge)({}, cfg, { fonts: _defineProperty({}, font.family, { variants: variants, formats: formats }) }));
    });
  }
  return installPromise.then((0, _utils.successThen)(font.family + ' downloaded - ' + variants.length + ' variant(s), ' + formats.length + ' format(s)'));;
}

function installFontInternal(fontName) {
  return (0, _config.config)().then(function (cfg) {
    if (!cfg.apiKey) {
      (0, _utils.error)('Mandatory apiKey field missing from config');
    } else {
      return (0, _find.findByName)(fontName, cfg.apiKey).then(function (font) {
        if (!font) {
          (0, _utils.error)('Font ' + fontName + ' was not found');
        } else {
          return _inquirer2.default.prompt(questions(font)).then(function (_ref) {
            var variants = _ref.variants;
            var formats = _ref.formats;
            var save = _ref.save;

            return installFont(font, variants, formats, save, cfg);
          });
        }
      }).catch(function (e) {
        (0, _utils.error)(e.message);console.log(e);
      });
    }
  }).catch(function (_) {
    return (0, _utils.error)('Can\'t read ' + (0, _config.configFilePath)());
  });
}

function installFromConfig() {
  return (0, _config.config)().then(function (cfg) {
    if (!cfg.apiKey) {
      (0, _utils.error)('Mandatory apiKey field missing from config');
    } else {
      var _ret = function () {
        var fontsFromCfg = cfg.fonts || {};
        var findFontPromises = Object.keys(fontsFromCfg).map(function (name) {
          return (0, _find.findByName)(name, cfg.apiKey).then((0, _utils.successThen)(name + ' found'));
        });
        var findFonts = Promise.all(findFontPromises);
        return {
          v: findFonts.then(function (fonts) {
            return Promise.all(fonts.map(function (font) {
              var _fontsFromCfg$font$fa = fontsFromCfg[font.family];
              var variants = _fontsFromCfg$font$fa.variants;
              var formats = _fontsFromCfg$font$fa.formats;

              return installFont(font, variants || [], formats || [], false, cfg);
            }));
          })
        };
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    }
  }).catch(function (e) {
    return (0, _utils.error)(e.message);
  });
}

function install(input, args) {
  if (input.length > 0) {
    return installFontInternal((0, _lodash.head)(input));
  } else {
    return installFromConfig();
  }
}