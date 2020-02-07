const { readFileSync, existsSync, statSync, writeFileSync } = require('fs');
const querystring = require('querystring');

const CONTENT_TYPES = require('./mimeTypes');
const { App } = require('./app');
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

const readBody = (request, response, next) => {
  const contentType = request.headers['content-type'];
  let body = '';
  request.on('data', data => {
    body += data;
    return body;
  });
  request.on('end', () => {
    request.body = body;
    if (contentType === 'application/x-www-form-urlencoded') {
      request.body = querystring.parse(request.body);
    }
    next();
  });
};

const methodNotAllowed = (request, response) => {
  response.writeHead(methodNotAllowedStatusCode);
  response.end();
};

const pageNotFound = (request, response) => {
  response.writeHead(notFoundStatusCode);
  response.end('Page Not Found');
};

const serveStaticFile = (request, response, next) => {
  const url = request.url === '/' ? '/index.html' : request.url;
  const path = `${STATIC_FOLDER}${url}`;
  const extension = path.split('.').pop();
  if (!isFileExists(path)) {
    next();
    return;
  }
  const content = readFileSync(path);
  response.setHeader('Content-Type', CONTENT_TYPES[extension]);
  response.end(content);
};

const serveTodoLists = (request, response, next) => {
  response.setHeader('Content-Type', CONTENT_TYPES.json);
  response.end(JSON.stringify(collection.todos));
};

const addTodoList = (request, response, next) => {
  const body = [];
  for (property in request.body) {
    body.push(request.body[property]);
  }
  const [title, ...tasks] = body;
  collection.addNewTodo(title, tasks);
  collection.saveToFile(writeFileSync.bind(null, DATA_STORE_PATH));
  response.statusCode = 303;
  response.setHeader('Location', '/');
  response.end();
};

const deleteTodoList = (request, response, next) => {
  const todoListId = request.body;
  collection.deleteTodo(todoListId);
  collection.saveToFile(writeFileSync.bind(null, DATA_STORE_PATH));
  response.setHeader('Content-Type', CONTENT_TYPES.json);
  response.end(JSON.stringify(collection.todos));
};

const addTask = (request, response, next) => {
  const [todoListId, taskName] = request.body.split(',');
  collection.addTask(todoListId, taskName);
  collection.saveToFile(writeFileSync.bind(null, DATA_STORE_PATH));
  response.setHeader('Content-Type', CONTENT_TYPES.json);
  response.end(JSON.stringify(collection.todos));
};

const deleteTask = (request, response, next) => {
  const [todoListId, taskId] = request.body.split(',');
  collection.deleteTask(todoListId, taskId);
  collection.saveToFile(writeFileSync.bind(null, DATA_STORE_PATH));
  response.setHeader('Content-Type', CONTENT_TYPES.json);
  response.end(JSON.stringify(collection.todos));
};

const toggleTask = (request, response, next) => {
  const [todoListId, taskId] = request.body.split(',');
  collection.toggleTask(todoListId, taskId);
  collection.saveToFile(writeFileSync.bind(null, DATA_STORE_PATH));
  response.setHeader('Content-Type', CONTENT_TYPES.json);
  response.end(JSON.stringify(collection.todos));
};

const editTitle = (request, response, next) => {
  const [todoListId, title] = request.body.split(',');
  collection.editTitle(todoListId, title);
  collection.saveToFile(writeFileSync.bind(null, DATA_STORE_PATH));
  response.setHeader('Content-Type', CONTENT_TYPES.json);
  response.end(JSON.stringify(collection.todos));
};

const app = new App();

app.get('/getTodoLists', serveTodoLists);
app.get('', serveStaticFile);
app.get('', pageNotFound);

app.use(readBody);

app.post('/addTodoList', addTodoList);
app.post('/deleteTodoList', deleteTodoList);
app.post('/addTask', addTask);
app.post('/deleteTask', deleteTask);
app.post('/toggleTask', toggleTask);
app.post('/editTitle', editTitle);
app.post('', pageNotFound);

app.use(methodNotAllowed);

module.exports = { app };
