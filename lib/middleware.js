// will implement middleware class here
class Middleware {
  // logic
  constructor() {
    // initialization
    this.global_middlewares = [];
    this.middlewares = {};
    this.sub_applications = {};
  }

  add() {}
  getMiddleware(path) {}
}

module.exports = Middleware;
