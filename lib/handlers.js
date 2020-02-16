const { readFileSync, existsSync, statSync, writeFileSync } = require('fs');

const config = require('../config');
const { UserManager } = require('./userManager');
const { SessionManager } = require('./sessionManager');

const STATIC_FOLDER = `${__dirname}/../public`;
const notFoundStatusCode = 404;
const methodNotAllowedStatusCode = 405;

const isFileExists = path => existsSync(path) && statSync(path);

const readFile = url => readFileSync(url, 'utf8');

const saveUserTodos = todos => {
  writeFileSync(config.DATA_STORE, JSON.stringify(todos));
};

const userManager = UserManager.initializeUsers(readFile(config.DATA_STORE));
const sessionManager = new SessionManager();
console.log(userManager, sessionManager);

const isUserLoggedIn = function(req, res, next) {
  console.log('hii------------', req.url);
  const username = sessionManager.getUsername(req.cookies.sessionId);
  if (username) {
    req.body.username = username;
    return next();
  }
  res.redirect('/login.html');
};

const serveStaticFile = (req, res) => {
  console.log('hello', req.url);
  const path = `${STATIC_FOLDER}${url}`;
  if (!isFileExists(path)) {
    next();
    return;
  }
  const content = readFile(path);
  res.send(content);
};

const serveTodoLists = (req, res) => {
  const user = userManager.getUser('kumar');
  res.json(collection.todos);
};

const addTodoList = (req, res) => {
  const user = userManager.getUser('kumar');
  const body = [];
  for (property in req.body) {
    body.push(req.body[property]);
  }
  const [title, ...tasks] = body;
  collection.addNewTodo(title, tasks);
  saveUserTodos(collection.todos);
  res.redirect('/');
};

const deleteTodoList = (req, res) => {
  const user = userManager.getUser('kumar');
  const { todoListId } = req.body;
  collection.deleteTodo(todoListId);
  saveUserTodos(collection.todos);
  res.json(collection.todos);
};

const addTask = (req, res) => {
  const user = userManager.getUser('kumar');
  const { todoListId, taskName } = req.body;
  collection.addTask(todoListId, taskName);
  saveUserTodos(collection.todos);
  res.json(collection.todos);
};

const deleteTask = (req, res) => {
  const user = userManager.getUser('kumar');
  const { todoListId, taskId } = req.body;
  collection.deleteTask(todoListId, taskId);
  saveUserTodos(collection.todos);
  res.json(collection.todos);
};

const toggleTask = (req, res) => {
  const user = userManager.getUser('kumar');
  const { todoListId, taskId } = req.body;
  collection.toggleTask(todoListId, taskId);
  saveUserTodos(collection.todos);
  res.json(collection.todos);
};

const editTitle = (req, res) => {
  const user = userManager.getUser('kumar');
  const { todoListId, title } = req.body;
  collection.editTitle(todoListId, title);
  saveUserTodos(collection.todos);
  res.send(collection.todos);
};

const editTask = (req, res) => {
  const user = userManager.getUser('kumar');
  const { todoListId, taskId, name } = req.body;
  collection.editTask(todoListId, taskId, name);
  saveUserTodos(collection.todos);
  res.send(collection.todos);
};

const pageNotFound = (req, res) => {
  res.status(notFoundStatusCode).send('Page Not Found');
};

const methodNotAllowed = (req, res) => {
  res.status(methodNotAllowedStatusCode);
};

module.exports = {
  isUserLoggedIn,
  serveTodoLists,
  serveStaticFile,
  addTodoList,
  deleteTodoList,
  addTask,
  deleteTask,
  toggleTask,
  editTitle,
  editTask,
  pageNotFound,
  methodNotAllowed
};
