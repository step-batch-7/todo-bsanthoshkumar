const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const {
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
} = require('./handlers');

const app = express();

app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.get('/getTodoLists', serveTodoLists);
app.get('', serveStaticFile);
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
