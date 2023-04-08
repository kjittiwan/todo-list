export default class Task {
  constructor(_name, _desc, _date) {
    this.name = _name;
    this.date = _date;
    this.desc = _desc;
    this.id = Date.now().toString();
  }

  getName() {
    return this.name;
  }

  setName(_name) {
    this.name = _name;
  }

  getDesc() {
    return this.desc;
  }

  setDesc(_desc) {
    this.desc = _desc;
  }

  getDate() {
    return this.date;
  }

  setDate(_date) {
    this.date = _date;
  }

  getId() {
    return this.id;
  }
}
