const parse = require("./parser.js");

const method_number = {
  "": 0,
  GET: 1,
  POST: 2,
  PUT: 3,
  DELETE: 4,
  OPTIONS: 5,
  HEAD: 6,
};

function flattenHandlers(fns) {
  const result = [];
  for (const fn of fns) {
    if (Array.isArray(fn)) {
      result.push(...fn);
    } else {
      result.push(fn);
    }
  }

  return result;
}

class Router {
  constructor() {
    this.routes = [];
    this.get = this.add.bind(this, "GET");
    this.post = this.add.bind(this, "POST");
    this.put = this.add.bind(this, "PUT");
    this.delete = this.add.bind(this, "DELETE");
    this.options = this.add.bind(this, "OPTIONS");
    this.head = this.add.bind(this, "HEAD");
  }

  use() {}

  add(method, route, ...fns) {
    let { keys, pattern } = parse(route);
    let handlers = flattenHandlers(fns);
    const routeObject = {
      key: keys,
      pattern: pattern,
      method: method,
      handlers: handlers,
      midx: method_number[method],
    };
    this.routes.push(routeObject);
    return this;
  }

  // overall find takes a method and a path and returns the matching route handler
  find(method, url) {
    let m_num = method_number[method];
    let is_head = false;
    if (m_num === 6) {
      is_head = true;
    }

    let j = 0;
    let k;
    let temp;
    let routes = this.routes;
    let matches = [];
    let params = {};
    let handlers = [];
    for (var i = 0; i < routes.length; i++) {
      temp = routes[i];
      if (
        temp.midx === m_num ||
        temp.midx === 0 ||
        (is_head && temp.midx === 6)
      ) {
        // console.log("temp in find is ", temp);
        if (temp.key === false) {
          matches = temp.pattern.exec(url);
          if (matches === null) {
            continue;
          }
          if (matches.groups !== undefined) {
            for (k in matches.groups) {
              params[k] = matches.groups[k];
            }
          }
          if (temp.handlers.length > 1) {
            handlers = handlers.concat(temp.handlers);
          } else {
            handlers.push(temp.handlers[0]);
          }
        } else if (temp.key.length > 0) {
          matches = temp.pattern.exec(url);
          if (matches === null) {
            continue;
          }
          for (j = 0; j < temp.key.length; j++) {
            params[temp.key[j]] = matches[j];
          }
          if (temp.handlers.length > 1) {
            handlers = handlers.concat(temp.handlers);
          } else {
            handlers.push(temp.handlers[0]);
          }
        } else if (temp.pattern.test(url)) {
          if (temp.handlers.length > 1) {
            handlers = handlers.concat(temp.handlers);
          } else {
            handlers.push(temp.handlers[0]);
          }
        } else {
          // no match for this method and url
        }
      }
    }

    return { params, handlers };
  }
}

module.exports = Router;
