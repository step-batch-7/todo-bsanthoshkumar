class Task {
  constructor(id, name, isDone) {
    this.name = name;
    this.id = id;
    this.isDone = isDone;
  }
  toggleState() {
    this.isDone = !this.isDone;
  }
  static createTask(taskObject, index) {
    const { name, isDone } = taskObject;
    const id = index + 1;
    return new Task(id, name, isDone);
  }
}

module.exports = { Task };
