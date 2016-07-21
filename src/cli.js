import minimist from 'minimist';
import {omit} from 'lodash';
import init from './commands/init';
import install from './commands/install';

const options = minimist(process.argv.slice(2));
const command = options['_'][0];
const input = options['_'].slice(1);
const args = omit(options, ['_']);

switch (command) {
  case 'install': install(input, args); break;
  case 'init': init(input, args); break;
}
