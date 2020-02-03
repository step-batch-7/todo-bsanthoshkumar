const addTodoList = function() {
  const mainDivision = document.getElementById('mainDivision');
  const newTodo = document.createElement('div');
  newTodo.className = 'todoList';
  mainDivision.prepend(newTodo);
};
