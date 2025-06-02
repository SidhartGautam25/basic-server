const createRequestHandler = require("./final-handler");
const Middleware = require("./middleware");
const Router = require("./router_v2");

const errorOccured = require("./utils/errorOccured");
const nothingMatches = require("./utils/whenNothingMatches");

class BasicServer {
  constructor(opts = {}) {
    super(opts);
    this.middlewares = new Middleware();
    this.noMatches = opts.noMatches || nothingMatches;
    this.error = opts.error || errorOccured;
    this.router = new Router();
    this.runsOnEveryRequest = createRequestHandler(this, this.router);
  }

  addMiddleware(base, ...fns) {
    this.middlewares.add(base, ...fns);
  }
  runServerOn(port, callback) {
    if (!this.server) {
      this.server = http.createServer();
      this.server.on("request", this.runsOnEveryRequest);
    }

    this.server.listen(port, callback);
    return this;
  }
}
