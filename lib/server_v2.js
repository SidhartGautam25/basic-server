const Middleware = require("./middleware");
const errorOccured = require("./utils/errorOccured");
const nothingMatches = require("./utils/whenNothingMatches");

class BasicServer extends Router {
  constructor(opts = {}) {
    super(opts);
    this.middlewares = new Middleware();
    this.noMatches = opts.noMatches || nothingMatches;
    this.error = opts.error || errorOccured;
    this.runsOnEveryRequest = this.runsOnEveryRequest.bind(this);
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
