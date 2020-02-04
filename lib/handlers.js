const { readFileSync, existsSync, statSync, writeFileSync } = require('fs');
const querystring = require('querystring');

const CONTENT_TYPES = require('./mimeTypes');
const { App } = require('./app');

const STATIC_FOLDER = `${__dirname}/../public`;
const notFoundStatusCode = 404;
const methodNotAllowedStatusCode = 405;

const todoLists = [
  {
    title: 'title1',
    items: [
      { value: 'value1', isDone: false },
      { value: 'value2', isDone: false }
    ],
    id: 1
  },
  {
    title: 'title2',
    items: [
      { value: 'value1', isDone: false },
      { value: 'value2', isDone: false },
      { value: 'value1', isDone: false }
    ],
    id: 2
  },
  {
    title: 'title2',
    items: [
      { value: 'value1', isDone: false },
      { value: 'value2', isDone: false },
      { value: 'value1', isDone: false },
      { value: 'value2', isDone: false },
      { value: 'value1', isDone: false },
      { value: 'value2', isDone: false }
    ],
    id: 2
  },
  {
    title: 'title1',
    items: [
      { value: 'value1', isDone: false },
      { value: 'value2', isDone: false }
    ],
    id: 1
  },
  {
    title: 'title2',
    items: [
      { value: 'value1', isDone: false },
      { value: 'value2', isDone: false },
      { value: 'value1', isDone: false },
      { value: 'value2', isDone: false },
      { value: 'value1', isDone: false },
      { value: 'value2', isDone: false }
    ],
    id: 2
  },
  {
    title: 'title1',
    items: [
      { value: 'value1', isDone: false },
      { value: 'value2', isDone: false }
    ],
    id: 1
  }
];

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
  response.end(JSON.stringify(todoLists));
};

const addNewTodoList = (request, response, next) => {
  const { title } = request.body;
  const id = `todo-${title}`;
  console.log(request.body);
  let items = [];
  for (property in request.body) {
    if (property.includes('item')) {
      const value = request.body[property];
      items.push({ value, isDone: false });
    }
  }
  todoLists.unshift({ id, title, items });
  response.statusCode = 303;
  response.setHeader('Location', '/');
  response.end();
};

const app = new App();

app.get('/getTodoLists', serveTodoLists);
app.get('', serveStaticFile);
app.get('', pageNotFound);

app.use(readBody);

app.post('/addTodoList', addNewTodoList);
app.post('', pageNotFound);

app.use(methodNotAllowed);

module.exports = { app };
