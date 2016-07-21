import {head, find, startsWith, difference, omit, assign, merge} from 'lodash';
import inquirer from 'inquirer';

import {download} from '../lib/download';
import {convert} from '../lib/convert';
import {findByName} from '../lib/find';
import {write} from '../lib/write';
import {config, configFilePath, configFileName, writeConfig} from '../lib/config';
import {success, error, successThen, errorThen, logThen} from '../lib/utils';

const variantMapping = {
  '100': 'hairline',
  '200': 'extra light',
  '300': 'light',
  '400': 'regular',
  '500': 'medium',
  '600': 'semi bold',
  '700': 'bold',
  '800': 'extra bold',
  '900': 'heavy',
}

function variantName(variant) {
  if (variantMapping[variant]) {
    return `${variantMapping[variant]}`;
  } else {
    const baseVariant = find(Object.keys(variantMapping), key => startsWith(variant, key));
    if (baseVariant) {
      const extra = variant.replace(baseVariant, '');
      return `${variantMapping[baseVariant]} ${extra}`;
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
    choices: variants
      .map(variant => ({ name: variantName(variant), value: variant }))
      .sort((a, b) => a.value.localeCompare(b.value))
  };
}

function questions(font) {
  return [
    variantsQuestion(font.variants),
    {
      type: 'checkbox',
      name: 'formats',
      message: 'Formats:',
      default: ['ttf', 'woff', 'eot', 'svg'],
      choices: [
        { name: 'ttf', value: 'ttf' },
        { name: 'woff', value: 'woff' },
        { name: 'eot', value: 'eot' },
        { name: 'svg', value: 'svg' },
        { name: 'woff2 (work in progress)', value: 'woff2' },
      ]
    },
    {
      type: 'confirm',
      message: `Save to ${configFileName()}`,
      name: 'save',
      default: true,
    }
  ];
}


function installFont(font, variants, formats, save, cfg) {
  let installPromise = download(font, variants, formats).then(font => {
   	return write(font, cfg.output || 'fonts');
  });
  if (save) {
    installPromise = installPromise.then(_ => writeConfig(merge({}, cfg, { fonts: { [font.family]: { variants, formats } } })))
  }
  return installPromise.then(successThen(`${font.family} downloaded - ${variants.length} variant(s), ${formats.length} format(s)`));;
}

function installFontInternal(fontName) {
  return config().then(cfg => {
    if (!cfg.apiKey) {
      error('Mandatory apiKey field missing from config');
    } else {
      return findByName(fontName, cfg.apiKey).then(font => {
        if (!font) {
          error(`Font ${fontName} was not found`);
        } else {
          return inquirer.prompt(questions(font)).then(({variants, formats, save}) => {
            return installFont(font, variants, formats, save, cfg);
          });
        }
      }).catch(e => { error(e.message); console.log(e) });
    }
  }).catch(_ => error(`Can't read ${configFilePath()}`))
}

function installFromConfig() {
  return config().then(cfg => {
    if (!cfg.apiKey) {
      error('Mandatory apiKey field missing from config');
    } else {
      const fontsFromCfg = cfg.fonts || {};
      const findFontPromises = Object.keys(fontsFromCfg)
        .map(name => findByName(name, cfg.apiKey).then(successThen(`${name} found`)))
      const findFonts = Promise.all(findFontPromises);
      return findFonts.then(fonts => {
        return Promise.all(fonts.map(font => {
          const {variants, formats} = fontsFromCfg[font.family];
          return installFont(font, variants || [], formats || [], false, cfg);
        }));
      });
    }
  }).catch(e => error(e.message));
}

export default function install(input, args) {
  if (input.length > 0) {
    return installFontInternal(head(input));
  } else {
    return installFromConfig();
  }
}