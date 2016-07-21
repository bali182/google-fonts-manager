import chalk from 'chalk';

export const OK = '✔';
export const NOK = '✖';
export const success = message => console.log(`${chalk.green(OK)} ${message}`);
export const error = message => console.log(`${chalk.red(NOK)} ${message}`);

export const successThen = message => result => {
  success(message);
  return result;
}

export const errorThen = message => result => {
  error(message);
  return result;
}

export const logThen = message => result => {
  console.log(message);
  return result;
}