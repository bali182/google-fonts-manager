import chalk from 'chalk';

export const OK = '✔';
export const NOK = '✖';
export const success = message => console.log(`${chalk.green(OK)} ${message}`);
export const error = message => console.log(`${chalk.red(NOK)} ${message}`);