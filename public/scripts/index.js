const createElement = elementName => document.createElement(elementName);
const getElement = selector => document.querySelector(selector);

const togglePopUp = () => {
  const popUpDivision = getElement('#popUpDivision');
  const displayValue = popUpDivision.style.display;
  popUpDivision.style.display = displayValue === 'block' ? 'none' : 'block';
  return;
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

const createHeader = title => {
  const header = createElement('h4');
  header.classList.add('heading');
  header.innerText = title;
  return header;
};

const createTask = item => {
  const { value, isDone } = item;
  const task = document.createElement('p');
  task.innerHTML = value + '<br/>';
  return task;
};
const createTodoList = todoList => {
  const { id, title, items } = todoList;
  console.log(todoList);
  const todoDivision = document.createElement('div');
  const header = createHeader(title);
  const line = createElement('hr');
  todoDivision.id = id;
  todoDivision.classList.add('todoList');
  todoDivision.append(header);
  todoDivision.append(line);
  items.map(item => todoDivision.append(createTask(item)));
  return todoDivision;
};

const showTodoLists = text => {
  const container = getElement('#container');
  const todoLists = JSON.parse(text);
  const todoListsAsHtml = todoLists.map(createTodoList);
  container.innerHTML = '';
  todoListsAsHtml.forEach(todoList => container.append(todoList));
};

const loadTodoLists = () => sendHttpGet('/getTodoLists', showTodoLists);

const main = () => {
  loadTodoLists();
};
