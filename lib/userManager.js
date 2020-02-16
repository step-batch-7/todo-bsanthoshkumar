const { TodoList } = require('./todoList');

class User {
  constructor(name, username, password, todoLists) {
    this.name = name;
    this.username = username;
    this.password = password;
    this.todoLists = todoLists.slice();
  }
  get newTodoId() {
    const lastTodo = this.todoLists[this.todoLists.length - 1];
    const id = lastTodo && lastTodo.id + 1;
    return id || 1;
  }
  findIndex(todoId) {
    return this.todoLists.findIndex(todoList => todoList.id == todoId);
  }
  addNewTodo(title, tasks) {
    const id = this.newTodoId;
    const newTodo = new TodoList(id, title, []);
    tasks.map(task => newTodo.addTask(task));
    this.todoLists.unshift(newTodo);
  }
  deleteTodo(todoId) {
    const index = this.findIndex(todoId);
    this.todoLists.splice(index, 1);
  }
  addTask(todoListId, taskName) {
    const index = this.findIndex(todoListId);
    this.todoLists[index].addTask(taskName);
  }
  deleteTask(todoListId, taskId) {
    const index = this.findIndex(todoListId);
    this.todoLists[index].deleteTask(taskId);
  }
  toggleTask(todoListId, taskId) {
    const index = this.findIndex(todoListId);
    this.todoLists[index].toggleTask(taskId);
  }
  editTitle(todoListId, title) {
    const index = this.findIndex(todoListId);
    this.todoLists[index].editTitle(title);
  }
  editTask(todoListId, taskId, name) {
    const index = this.findIndex(todoListId);
    this.todoLists[index].editTask(taskId, name);
  }
  static createUser(user) {
    const { name, username, password } = user;
    const todoLists = user.todoLists.map(TodoList.createNewTodoList);
    return new User(name, username, password, todoLists);
  }
}

class UserManager {
  constructor(usersInfo) {
    this.users = usersInfo;
  }

  addNewUser(name, username, password) {
    const newUser = new User(name, username, password, []);
    this.users.push(newUser);
  }

  getUser(username) {
    return this.users.find(user => user.username == username);
  }

  matchUser(username, password) {
    return this.users.find(user => user.username == username && user.password == password);
  }

  static initializeUsers(usersData) {
    let usersInfo = JSON.parse(usersData || '[]');
    usersInfo = usersInfo.map(user => User.createUser(user));
    return new UserManager(usersInfo);
  }
}

module.exports = { UserManager };
