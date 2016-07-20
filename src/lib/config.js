import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';

const readFile = Promise.promisify(fs.readFile);
const writeFile = Promise.promisify(fs.writeFile);
const stat = Promise.promisify(fs.stat);

export function configFileName() {
  return 'google-fonts.json';
}

export function configFilePath() {
  return path.join(process.cwd(), configFileName());
}

export function defaultConfig() {
  return {
    fonts: [],
    formats: ['ttf', 'woff', 'woff2'],
    output: 'fonts'
  };
}

export function config() {
  return readFile(configFilePath(), 'utf-8').then(data => JSON.parse(data));
}

export function writeConfig(config) {
  return writeFile(configFilePath(), JSON.stringify(config, null, 2), 'utf-8');
}

export function createConfig() {
  return writeConfig(defaultConfig());
}

export function configExists() {
  return stat(configFilePath())
    .then(_ => true)
    .catch(error => {
      if (error.code === 'ENOENT') {
        return Promise.resolve(false);
      } else {
        throw error;
      }
    });
}