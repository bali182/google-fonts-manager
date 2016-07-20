import inquirer from 'inquirer';
import {merge} from 'lodash';
import {configExists, writeConfig, config} from '../lib/config';
import {success} from '../lib/utils';

const questions = [
  {
    type: 'input',
    name: 'apiKey',
    message: 'Google fonts API key:',
    validate: input => input && input.length > 0
  },
  {
    type: 'input',
    name: 'output',
    default: 'fonts',
    message: 'Installation path:',
    validate: input => input && input.length > 0
  }
]

export default function init(options) {
  inquirer.prompt(questions).then(answers => {
    const newCfgData = {
      apiKey: answers.apiKey,
      output: answers.output,
      fonts: {},
    };
    return configExists().then(exists => {
      if (exists) {
        return config().then(cfg => {
          return writeConfig(merge({}, cfg, newCfgData)).then(_ => success('Config updated'));
        })
      } else {
        return writeConfig(newCfgData).then(_ => success('Config created'));
      }
    })
  });
}
