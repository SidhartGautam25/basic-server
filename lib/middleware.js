const BasicServer = require("./server_v2");

// will implement middleware class here
class Middleware {
  // logic
  constructor() {
    // initialization
    this.global_middlewares = [];
    this.middlewares = {};
    this.sub_applications = {};
  }

  // need to work on this
  add(base, ...fns) {
    if (typeof base === "function") {
      this.global_middlewares = this.global_middlewares.concat(base, fns);
    } else if (base === "/") {
      this.global_middlewares = this.global_middlewares.concat(fns);
    } else {
      base = this._ensureLeadingSlash(base);
      for (const fn of fns) {
        if (fn instanceof BasicServer) {
          this.sub_applications[base] = fn;
        } else {
          this.middlewares[base] = this.middlewares[base] || [];
          this.middlewares[base].push(fn);
        }
      }
    }
    return this;
  }
  getMiddlewareForBase(base) {
    return this.middlewares[base] || [];
  }
  getGlobalMiddlewares() {
    return this.global_middlewares;
  }
  _ensureLeadingSlash(path) {
    return path.startsWith("/") ? path : "/" + path;
  }
}

module.exports = Middleware;
