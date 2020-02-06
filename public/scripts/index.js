const createElement = elementName => document.createElement(elementName);
const getElement = selector => document.querySelector(selector);

const togglePopUp = () => {
  const popUpDivision = getElement('#popUpDivision');
  const displayValue = popUpDivision.style.display;
  if (displayValue === 'none') {
    popUpDivision.style.display = 'block';
    return;
  }
  popUpDivision.style.display = 'none';
};

const toggleBackground = () => {
  const body = document.body;
  console.log(body.classList.contains('blackbg'));
  if (body.classList.contains('blackbg')) {
    body.classList.remove('blackbg');
    return;
  }
  body.classList.add('blackbg');
};

const createItem = id => {
  const input = createElement('input');
  const label = createElement('label');
  input.type = 'text';
  input.name = `item${id}`;
  input.id = `item${id}`;
  input.classList.add('textbox');
  label.innerText = `Item${id}:`;
  return { input, label };
};

const addItem = () => {
  const items = getElement('#items');
  const id = document.querySelectorAll('.textbox').length;
  const { input, label } = createItem(id);
  items.append(label);
  items.append(input);
};

const removeItem = () => {
  const items = document.querySelector('#items');
  items.removeChild(items.lastChild);
  items.removeChild(items.lastChild);
};

const sendHttpGet = (url, callback) => {
  const request = new XMLHttpRequest();
  request.open('GET', url);
  request.onload = function() {
    if (this.status === 200) {
      callback(this.responseText);
    }
  };
  request.send();
};

const sendHttpPost = (url, data, callback) => {
  const request = new XMLHttpRequest();
  request.open('POST', url);
  request.onload = function() {
    if (this.status === 200) {
      callback(this.responseText);
    }
  };
  request.send(data);
};

const createTasks = items => {
  return items.map(item => `<div class="todoItem"><div id="tickbox"></div>${item.value}</div>`);
};

const createTodoList = todoList => {
  const { id, title, items } = todoList;
  return `
  <div class="todoList" id="${id}">
    <div class="heading">${title}
    <img src="assets/deleteicon.png" alt="no image" class="deleteButton" onclick="deleteTodoList('${id}')"/>
    </div>
    <hr />
    ${createTasks(items).join('\n')}
  </div>`;
};

const showTodoLists = text => {
  const container = getElement('#container');
  const todoLists = JSON.parse(text);
  const todoListsAsHtml = todoLists.map(createTodoList).join('\n');
  container.innerHTML = '';
  container.innerHTML = todoListsAsHtml;
};

const deleteTodoList = todoListId => sendHttpPost('/deleteTodoList', todoListId, showTodoLists);

const loadTodoLists = () => sendHttpGet('/getTodoLists', showTodoLists);

const main = () => {
  loadTodoLists();
};
