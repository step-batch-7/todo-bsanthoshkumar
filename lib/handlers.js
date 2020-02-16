const { readFileSync, existsSync, statSync, writeFileSync } = require('fs');

const { Collection } = require('./todoListCollection');

const STATIC_FOLDER = `${__dirname}/../public`;
const DATA_STORE_PATH = `${__dirname}/../datastore/todos.json`;
const notFoundStatusCode = 404;
const methodNotAllowedStatusCode = 405;

const content = require(DATA_STORE_PATH);
const collection = Collection.storeTodos(content);

const isFileExists = path => {
  return existsSync(path) && statSync(path);
};

const serveTodoLists = (req, res) => {
  res.json(collection.todos);
};

const addTodoList = (req, res) => {
  const body = [];
  for (property in req.body) {
    body.push(req.body[property]);
  }
  const [title, ...tasks] = body;
  collection.addNewTodo(title, tasks);
  collection.saveToFile(writeFileSync.bind(null, DATA_STORE_PATH));
  res.redirect('/');
};

const deleteTodoList = (req, res) => {
  console.log(req.body);
  const { todoListId } = req.body;
  collection.deleteTodo(todoListId);
  collection.saveToFile(writeFileSync.bind(null, DATA_STORE_PATH));
  res.json(collection.todos);
};

const addTask = (req, res) => {
  const { todoListId, taskName } = req.body;
  collection.addTask(todoListId, taskName);
  collection.saveToFile(writeFileSync.bind(null, DATA_STORE_PATH));
  res.json(collection.todos);
};

const deleteTask = (req, res) => {
  const { todoListId, taskId } = req.body;
  collection.deleteTask(todoListId, taskId);
  collection.saveToFile(writeFileSync.bind(null, DATA_STORE_PATH));
  res.json(collection.todos);
};

const toggleTask = (req, res) => {
  const { todoListId, taskId } = req.body;
  collection.toggleTask(todoListId, taskId);
  collection.saveToFile(writeFileSync.bind(null, DATA_STORE_PATH));
  res.json(collection.todos);
};

const editTitle = (req, res) => {
  const { todoListId, title } = req.body;
  collection.editTitle(todoListId, title);
  collection.saveToFile(writeFileSync.bind(null, DATA_STORE_PATH));
  res.send(collection.todos);
};

const editTask = (req, res) => {
  const { todoListId, taskId, name } = req.body;
  collection.editTask(todoListId, taskId, name);
  collection.saveToFile(writeFileSync.bind(null, DATA_STORE_PATH));
  res.send(collection.todos);
};

const serveStaticFile = (req, res) => {
  const url = req.url === '/' ? '/index.html' : req.url;
  const path = `${STATIC_FOLDER}${url}`;
  if (!isFileExists(path)) {
    next();
    return;
  }
  const content = readFileSync(path);
  res.send(content);
};

const pageNotFound = (req, res) => {
  res.status(notFoundStatusCode).send('Page Not Found');
};

const methodNotAllowed = (req, res) => {
  res.status(methodNotAllowedStatusCode);
};

module.exports = {
  serveTodoLists,
  addTodoList,
  deleteTodoList,
  addTask,
  deleteTask,
  toggleTask,
  editTitle,
  editTask,
  serveStaticFile,
  pageNotFound,
  methodNotAllowed
};
