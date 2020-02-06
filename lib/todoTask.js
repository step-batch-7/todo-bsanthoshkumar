class Task {
  constructor(id, name) {
    this.name = name;
    this.id = id;
    this.isDone = false;
  }
  toggleState() {
    this.isDone = !this.isDone;
  }
  static createTodoTask(taskObject, index) {
    const { name } = taskObject;
    const id = index + 1;
    return new Task(id, name);
  }
}

module.exports = { Task };
