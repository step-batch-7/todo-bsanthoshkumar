const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const {
  loginUser,
  signInUser,
  isUserLoggedIn,
  logoutUser,
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
} = require('./handlers');

const app = express();

app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.post('/login', loginUser);
app.post('/signIn', signInUser);

app.use(isUserLoggedIn);

app.get('/logout', logoutUser);
app.get('/', (req, res) => res.redirect('/todoPage'));
app.get('/todoPage', serveTodoPage);
app.get('/getTodoLists', serveTodoLists);
app.get('', pageNotFound);

app.post('/addTodoList', addTodoList);
app.post('/deleteTodoList', deleteTodoList);
app.post('/addTask', addTask);
app.post('/deleteTask', deleteTask);
app.post('/toggleTask', toggleTask);
app.post('/editTitle', editTitle);
app.post('/editTask', editTask);
app.post('', pageNotFound);

app.use(methodNotAllowed);

module.exports = { app };
