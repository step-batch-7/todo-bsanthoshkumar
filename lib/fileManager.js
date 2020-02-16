const { readFileSync, existsSync, statSync, writeFileSync } = require('fs');
const config = require('../config');

const isFileExists = path => existsSync(path) && statSync(path);

const readFile = url => readFileSync(url, 'utf8');

const saveUserTodos = todos => {
  writeFileSync(config.DATA_STORE, JSON.stringify(todos));
};

module.exports = { isFileExists, readFile, saveUserTodos };
