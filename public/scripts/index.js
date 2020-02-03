const getElement = id => document.getElementById(id);
const createElement = elementName => document.createElement(elementName);

const togglePopUp = () => {
  const popUpDivision = getElement('popUpDivision');
  const displayValue = popUpDivision.style.display;
  popUpDivision.style.display = displayValue === 'block' ? 'none' : 'block';
  return;
};

const addTodoList = () => {
  const mainDivision = getElement('mainDivision');
  const title = getElement('title').value;
  const newTodo = createElement('div');
  const heading = createElement('h4');
  heading.innerText = title;
  newTodo.className = 'todoList';
  newTodo.appendChild(heading);
  mainDivision.prepend(newTodo);
  togglePopUp();
  return;
};
