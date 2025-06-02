const parse = require("./parser.js");

const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  OPTIONS: "OPTIONS",
  HEAD: "HEAD",
  USE: "USE",
};

const METHOD_PRIORITY = {
  [HTTP_METHODS.USE]: 0,
  [HTTP_METHODS.GET]: 1,
  [HTTP_METHODS.POST]: 2,
  [HTTP_METHODS.PUT]: 3,
  [HTTP_METHODS.DELETE]: 4,
  [HTTP_METHODS.OPTIONS]: 5,
  [HTTP_METHODS.HEAD]: 6,
};

class Route {
  constructor(method, path, handlers) {
    const { keys, pattern } = parse(path, method === HTTP_METHODS.USE);
    this.method = method;
    this.keys = keys;
    this.pattern = pattern;
    this.priority = METHOD_PRIORITY[method];
  }
  match(method, url) {}
}
