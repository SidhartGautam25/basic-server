const http = require("http");
const Router = require("./router");
const leadingCharCheck = require("./utils/checkLeadingChar.js");
const getBase = require("./utils/getBase.js");
const nothingMatches = require("./utils/whenNothingMatches.js");
const parse = require("./utils/parseQuery.js");
const errorOccured = require("./utils/errorOccured.js");
const parser = require("../lib/utils/parse.js");

class BasicServer extends Router {
  constructor(opts = {}) {
    super(opts);
    this.global_middlewares = [];
    this.middlewares = {};
    this.sub_applications = {};
    this.noMatches = opts.noMatches || nothingMatches;
    this.error = opts.error || errorOccured;
    this.runsOnEveryRequest = this.runsOnEveryRequest.bind(this);
  }

  runServerOn(port, callback) {
    if (!this.server) {
      this.server = http.createServer();
      this.server.on("request", this.runsOnEveryRequest);
    }

    this.server.listen(port, callback);
    return this;
  }

  addMiddleware(base, ...fns) {
    console.log("base is ", base);
    if (typeof base === "function") {
      this.global_middlewares = this.global_middlewares.concat(base, fns);
    } else if (base === "/") {
      this.global_middlewares = this.global_middlewares.concat(fns);
    } else {
      base = leadingCharCheck(base);
      for (var i = 0; i < fns.length; i++) {
        let fn = fns[i];
        if (fn instanceof BasicServer) {
          this.sub_applications[base] = fn;
        } else {
          console.log("base in addMiddleware is ", base);
          let temp = this.middlewares[base] || [];
          this.middlewares[base] = temp.concat(fn);
        }
      }
    }
  }

  runsOnEveryRequest(req, res, extra) {
    console.log("running runsOnEveryRequest");
    if (!extra) {
      extra = parser(req);
    }
    req.completeURL = req.originalUrl || req.url;
    req.path = extra.pathname;
    console.log("req.path is ", req.path);
    const base = getBase(req.path);
    console.log("base is ", base);
    // console.log(
    //   "length of base middlewares is ",
    //   this.middlewares[base].length
    // );
    const base_middlewares = this.middlewares[base] || [];
    const sub_applications = this.sub_applications;
    let total_middlewares = this.global_middlewares;
    if (base && this.middlewares[base]) {
      console.log("length of base middlwares is ", base_middlewares.length);
      total_middlewares = total_middlewares.concat(base_middlewares);
    }

    let route_handlers = this.find(req.method, extra.pathname);
    let all_handlers = [];
    if (route_handlers) {
      all_handlers = route_handlers.handlers;
      req.params = route_handlers.params;
    } else if (this.sub_applications[base]) {
      // in progress
    }
    all_handlers.push(this.noMatches);
    req.query = parse(extra.query);
    total_middlewares = total_middlewares.concat(all_handlers);
    let length = total_middlewares.length;
    console.log("total length of functions to execute is ", length);
    let i = 0;
    const execute_next_handler = () => {
      if (i >= length) {
        return;
      }
      const current_handler = total_middlewares[i];
      i++;
      try {
        console.log("going to run ", i - 1, " handler");
        current_handler(req, res, next);
      } catch (err) {
        next(err);
      }
    };
    const next = (err) => {
      if (err) {
        return this.error(err, req, res, next);
      }
      execute_next_handler();
    };
    execute_next_handler();
  }
}

module.exports = BasicServer;
