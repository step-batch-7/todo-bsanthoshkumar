const { Task } = require('./todoTask');

class TodoList {
  constructor(id, title, tasks) {
    this.id = id;
    this.title = title;
    this.tasks = tasks.slice();
  }
  get newTaskId() {
    const lastTask = this.tasks[this.tasks.length - 1];
    const id = lastTask && lastTask.id + 1;
    return id || 1;
  }
  addTask(taskName) {
    const id = this.newTaskId;
    const newTask = new Task(id, taskName);
    this.tasks.push(newTask);
  }
  deleteTask(id) {
    const index = this.tasks.findIndex(task => task.id == id);
    this.tasks.splice(index, 1);
  }
  toggleTask(id) {
    const index = this.tasks.findIndex(task => task.id == id);
    this.tasks[index].toggleState();
  }
  static createNewTodoList(todoListObject, index) {
    const { title } = todoListObject;
    const id = index + 1;
    const tasks = todoListObject.tasks.map(Task.createTodoTask);
    return new TodoList(id, title, tasks);
  }
}

module.exports = { TodoList };
