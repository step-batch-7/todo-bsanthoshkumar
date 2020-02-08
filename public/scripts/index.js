const createElement = elementName => document.createElement(elementName);
const getElement = selector => document.querySelector(selector);

const createForm = () => {
  return `
  <div class="popUpBox animateZoom">
    <form action="addTodoList" method="post" class="todoform">
      <img src="./assets/closeicon.png" alt="no image" onclick="togglePopUp()" class="closeButton"/>
      <h4 class="formHeading">Create ToDo</h4>
      <span class="label">Title:</span>
      <input type="text" name="title" id="title" class="textbox" required /> <br />
      <div id="items"></div>
      <div class="todobtns">
        <input type="button" value="add item" onclick="addItem()" class="addButton" />
        <input type="button" value="remove item" onclick="removeItem()" class="removeButton" />
        <input type="submit" value="save" class="saveButton" />
      </div>
    </form>
      </div>`;
};
const togglePopUp = () => {
  const popUpDivision = getElement('#popUpDivision');
  const displayValue = popUpDivision.style.display;
  if (displayValue === 'none') {
    popUpDivision.style.display = 'block';
    popUpDivision.innerHTML = createForm();
    return;
  }
  popUpDivision.style.display = 'none';
};

const toggleBackground = () => {
  const body = document.body;
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
  input.name = `task${id}`;
  input.id = `task${id}`;
  input.classList.add('textbox');
  label.innerText = `Task${id}:`;
  label.classList.add('label');
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

const createTasks = (id, tasks) => {
  return tasks.map(task => {
    return `
    <div class="todoItem">
      <div class="tickbox ${task.isDone ? 'checked' : ''}" onclick="toggleTask(${id},${task.id})">
      </div>
      <div class="${task.isDone ? 'taskDone' : 'taskNotDone'}" contenteditable="true" onkeypress="editTask(${id},${
      task.id
    },this)">${task.name}</div>
      <img src="./assets/deleteicon.png" alt="no image" class="deleteButton" onclick="deleteTask(${id},${task.id})"/>
    </div>`;
  });
};

const createTodoList = todoList => {
  const { id, title, tasks } = todoList;
  return `
  <div class="todoList" id="${id}">
    <div class="heading">
    <span contenteditable="true" class="title" onkeypress="editTitle(${id},this)">${title}</span>
    <img src="assets/deleteicon.png" alt="no image" class="deleteButton" onclick="deleteTodoList(${id})"/>
    </div>
    ${createTasks(id, tasks).join('\n')}
    <input type='text' placeHolder="New Task..." class="newTaskBox" onkeypress="addTask(${id},this)"/>
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

const toggleTask = (todoListId, taskId) => {
  sendHttpPost('/toggleTask', [todoListId, taskId], showTodoLists);
};

const deleteTask = (todoListId, taskId) => {
  sendHttpPost('/deleteTask', [todoListId, taskId], showTodoLists);
};

const addTask = (todoListId, textbox) => {
  if (event.key === 'Enter' && textbox.value !== '') {
    const name = textbox.value;
    sendHttpPost('/addTask', [todoListId, name], showTodoLists);
  }
};

const editTitle = (todoListId, span) => {
  if (event.key === 'Enter' && span.innerText !== '') {
    const title = span.innerText;
    sendHttpPost('/editTitle', [todoListId, title], showTodoLists);
  }
};

const editTask = (todoListId, taskId, division) => {
  if (event.key === 'Enter' && division.innerText !== '') {
    const name = division.innerText;
    sendHttpPost('/editTask', [todoListId, taskId, name], showTodoLists);
  }
};

const loadTodoLists = () => sendHttpGet('/getTodoLists', showTodoLists);

const main = () => {
  loadTodoLists();
};

main();
