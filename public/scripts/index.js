const createElement = elementName => document.createElement(elementName);
const getElement = selector => document.querySelector(selector);

const createForm = () => {
  return `
  <form action="addTodoList" method="post" class="popUpBox animateZoom">
    <button type="button" class="closeButton" onclick="togglePopUp()">X</button>
    <h4 class="heading">Create ToDo</h4>
    Title:<input type="text" name="title" id="title" class="textbox" required /> <br />
    <div id="items"></div>
    <input type="button" value="+" onclick="addCheckBox()" id="addItem"/>
    <input type="submit" value="save" class="addButton"/>
  </form>`;
};

const togglePopUp = () => {
  const popUpDivision = getElement('#popUpDivision');
  const addTodoList = getElement('.addTodoList');
  const displayValue = popUpDivision.style.display;
  if (displayValue === 'none') {
    popUpDivision.style.display = 'block';
    popUpDivision.innerHTML = createForm();
    addTodoList.style.display = 'none';
    return;
  }
  popUpDivision.style.display = 'none';
  addTodoList.style.display = 'block';
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

const addCheckBox = () => {
  const items = getElement('#items');
  const id = document.querySelectorAll('.textbox').length;
  const { input, label } = createItem(id);
  items.append(label);
  items.append(input);
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

const createTasks = items => {
  return items.map(item => `<p>${item.value}</p><br />`).join('\n');
};

const createTodoList = todoList => {
  const { id, title, items } = todoList;
  return `
  <div class="todoList" id="${id}">
    <h4 class="heading">${title}</h4>
    <hr />
    ${createTasks(items)}
  </div>`;
};

const showTodoLists = text => {
  const container = getElement('#container');
  const todoLists = JSON.parse(text);
  const todoListsAsHtml = todoLists.map(createTodoList).join('\n');
  container.innerHTML = '';
  container.innerHTML = todoListsAsHtml;
};

const loadTodoLists = () => sendHttpGet('/getTodoLists', showTodoLists);

const main = () => {
  loadTodoLists();
};
