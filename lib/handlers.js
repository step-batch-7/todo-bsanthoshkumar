const config = require('../config');
const { UserManager } = require('./userManager');
const { SessionManager } = require('./sessionManager');
const { isFileExists, readFile, saveUserTodos } = require('./fileManager');

const TEMPLATE_FOLDER = `${__dirname}/../template`;
const notFoundStatusCode = 404;
const methodNotAllowedStatusCode = 405;

const userManager = UserManager.initializeUsers(readFile(config.DATA_STORE));
const sessionManager = new SessionManager();

const loginUser = function(req, res) {
  const { username, password } = req.body;
  const matchedUser = userManager.matchUser(username, password);
  if (matchedUser) {
    const sessionId = sessionManager.createSession(username);
    res.cookie('sessionId', sessionId);
    res.redirect('/todoPage');
    return;
  }
  res.redirect('/login.html');
};

const isUserLoggedIn = function(req, res, next) {
  const username = sessionManager.getUsername(req.cookies.sessionId);
  if (username) {
    req.body.username = username;
    return next();
  }
  res.redirect('/login.html');
};

const serveTodoPage = (req, res) => {
  const path = `${TEMPLATE_FOLDER}/todoPage.html`;
  const content = readFile(path);
  res.send(content);
};

const serveTodoLists = (req, res) => {
  const user = userManager.getUser('santhosh');
  res.json(user.todoLists);
};

const addTodoList = (req, res) => {
  const user = userManager.getUser('santhosh');
  const { title } = req.body;
  const tasks = [];
  for (property in req.body) {
    if (property.includes('task')) {
      tasks.push(req.body[property]);
    }
  }
  user.addNewTodo(title, tasks);
  saveUserTodos(userManager.users);
  res.redirect('/');
};

const deleteTodoList = (req, res) => {
  const user = userManager.getUser('santhosh');
  const { todoListId } = req.body;
  user.deleteTodo(todoListId);
  saveUserTodos(userManager.users);
  res.json(user.todoLists);
};

const addTask = (req, res) => {
  const user = userManager.getUser('santhosh');
  const { todoListId, taskName } = req.body;
  user.addTask(todoListId, taskName);
  saveUserTodos(userManager.users);
  res.json(user.todoLists);
};

const deleteTask = (req, res) => {
  const user = userManager.getUser('santhosh');
  const { todoListId, taskId } = req.body;
  user.deleteTask(todoListId, taskId);
  saveUserTodos(userManager.users);
  res.json(user.todoLists);
};

const toggleTask = (req, res) => {
  const user = userManager.getUser('santhosh');
  const { todoListId, taskId } = req.body;
  user.toggleTask(todoListId, taskId);
  saveUserTodos(userManager.users);
  res.json(user.todoLists);
};

const editTitle = (req, res) => {
  const user = userManager.getUser('santhosh');
  const { todoListId, title } = req.body;
  user.editTitle(todoListId, title);
  saveUserTodos(userManager.users);
  res.send(user.todoLists);
};

const editTask = (req, res) => {
  const user = userManager.getUser('santhosh');
  const { todoListId, taskId, name } = req.body;
  user.editTask(todoListId, taskId, name);
  saveUserTodos(userManager.users);
  res.send(user.todoLists);
};

const pageNotFound = (req, res) => {
  res.status(notFoundStatusCode).send('Page Not Found');
};

const methodNotAllowed = (req, res) => {
  res.status(methodNotAllowedStatusCode);
};

module.exports = {
  loginUser,
  isUserLoggedIn,
  serveTodoLists,
  serveTodoPage,
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
