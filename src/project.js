export default class Project {
  constructor(_name) {
    this.name = _name;
    this.tasks = [];
    this.id = Date.now().toString();
  }

  getName() {
    return this.name;
  }

  setName(_name) {
    this.name = _name;
  }

  getTasks() {
    return this.tasks;
  }

  setTasks(tasks) {
    this.tasks = tasks;
  }

  getId() {
    return this.id;
  }
}
