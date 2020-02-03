const { readFileSync, existsSync, statSync, writeFileSync } = require('fs');
const querystring = require('querystring');

const CONTENT_TYPES = require('./mimeTypes');
const { App } = require('./app');

const STATIC_FOLDER = `${__dirname}/../public`;
const notFoundStatusCode = 404;
const methodNotAllowedStatusCode = 405;

const isFileExists = path => {
  return existsSync(path) && statSync(path);
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

const app = new App();

app.get('', serveStaticFile);
app.get('', pageNotFound);

app.use(readBody);

app.post('', pageNotFound);

app.use(methodNotAllowed);

module.exports = { app };