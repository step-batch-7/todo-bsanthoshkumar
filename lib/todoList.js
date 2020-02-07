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
    const newTask = new Task(id, taskName, false);
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
  editTitle(title) {
    this.title = title;
  }
  editTask(taskId, name) {
    const index = this.tasks.findIndex(task => task.id == taskId);
    this.tasks[index].editTask(name);
  }
  static createNewTodoList(todoListObject, index) {
    const { title, tasks } = todoListObject;
    const id = index + 1;
    const taskObjects = tasks.map(Task.createTask);
    return new TodoList(id, title, taskObjects);
  }
}

module.exports = { TodoList };
