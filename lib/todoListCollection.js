const { TodoList } = require('./todoList');

class Collection {
  constructor(todos) {
    this.todos = todos.slice();
  }
  get newTodoId() {
    const lastTodo = this.todos[this.todos.length - 1];
    const id = lastTodo && lastTodo.id + 1;
    return id || 1;
  }
  addNewTodo(title, tasks) {
    const id = this.newTodoId;
    const newTodo = new TodoList(id, title, []);
    tasks.map(task => newTodo.addTask(task));
    this.todos.unshift(newTodo);
  }
  deleteTodo(todoId) {
    const index = this.todos.findIndex(todoList => todoList.id == todoId);
    console.log(todoId, index);
    this.todos.splice(index, 1);
  }
  saveToFile(writer) {
    writer(JSON.stringify(this.todos));
  }
  static storeTodos(content) {
    const todos = content.map(TodoList.createNewTodoList);
    return new Collection(todos);
  }
}

module.exports = { Collection };
