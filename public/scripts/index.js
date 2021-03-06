const createElement = elementName => document.createElement(elementName);
const getElement = selector => document.querySelector(selector);
const getElements = selector => document.querySelectorAll(selector);

const newRequest = function(method, url, data, callBack) {
  const req = new XMLHttpRequest();
  req.open(method, url);
  req.setRequestHeader('content-type', 'application/json');
  req.onload = function() {
    callBack(JSON.parse(this.response));
  };
  req.send(JSON.stringify(data));
};

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
  if (body.classList.contains('darkTheme')) {
    body.classList.remove('darkTheme');
    return;
  }
  body.classList.add('darkTheme');
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

const createTasks = (id, tasks) => {
  return tasks.map(task => {
    return `
    <div class="todoTask">
      <div class="tickbox ${task.isDone ? 'checked' : ''}" onclick="toggleTask(${id},${task.id})">
      </div>
      <div class="taskName ${task.isDone ? 'taskDone' : ''}" contenteditable="true" onkeypress="editTask(${id},${
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
  const todoLists = text;
  const todoListsAsHtml = todoLists.map(createTodoList).join('\n');
  container.innerHTML = '';
  container.innerHTML = todoListsAsHtml;
};

const deleteTodoList = todoListId => newRequest('POST', '/deleteTodoList', { todoListId }, showTodoLists);

const toggleTask = (todoListId, taskId) => {
  newRequest('POST', '/toggleTask', { todoListId, taskId }, showTodoLists);
};

const deleteTask = (todoListId, taskId) => {
  newRequest('POST', '/deleteTask', { todoListId, taskId }, showTodoLists);
};

const addTask = (todoListId, textbox) => {
  if (event.key === 'Enter' && textbox.value !== '') {
    const taskName = textbox.value;
    newRequest('POST', '/addTask', { todoListId, taskName }, showTodoLists);
  }
};

const editTitle = (todoListId, span) => {
  if (event.key === 'Enter' && span.innerText !== '') {
    const title = span.innerText;
    newRequest('POST', '/editTitle', { todoListId, title }, showTodoLists);
  }
};

const editTask = (todoListId, taskId, division) => {
  if (event.key === 'Enter' && division.innerText !== '') {
    const name = division.innerText;
    newRequest('POST', '/editTask', { todoListId, taskId, name }, showTodoLists);
  }
};

const searchByTask = (todoTasks, text) => {
  todoTasks.forEach(todoTask => {
    const taskName = todoTask.querySelector('.taskName');
    taskName.innerText.includes(text) ? todoTask.classList.remove('hidden') : todoTask.classList.add('hidden');
  });
};

const searchByTitle = (todoLists, text) => {
  todoLists.forEach(todoList => {
    const title = todoList.querySelector('.title');
    title.innerText.includes(text) ? todoList.classList.remove('hidden') : todoList.classList.add('hidden');
  });
};

const search = textbox => {
  const search = getElement('#search');
  const handler = search.checked ? searchByTask : searchByTitle;
  const className = search.checked ? '.todoTask' : '.todoList';
  const elements = Array.from(getElements(className));
  handler(elements, textbox.value);
};

const loadTodoLists = () => newRequest('GET', '/getTodoLists', '', showTodoLists);

const main = () => {
  loadTodoLists();
};

main();
