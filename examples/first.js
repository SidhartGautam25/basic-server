const BasicServer = require("../index.js");

const server = new BasicServer();

function middlewareOne(req, res, next) {
  console.log("request is coming to middleware 1");
  next();
}

function middlewareTwo(req, res, next) {
  console.log("request is coming to middleware 2");
  next();
}
function middlewareThree(req, res, next) {
  console.log("this middleware is for /info route");
  next();
}

function middlewareFour(req, res, next) {
  console.log("this is for /getName");
  next();
}

function middlewareFive(req, res, next) {
  req.name = "navneet";
  console.log("setting req.name");
  next();
}

server.addMiddleware(middlewareOne, middlewareTwo);
server.addMiddleware("/info", middlewareThree);
server.addMiddleware("/getName", middlewareFour);

server.get("/info", (req, res) => {
  console.log("hello from server");
  res.end(`Hello from server to the client`);
});

server.get("/getName", (req, res) => {
  console.log("hello from server for /getName route");
  res.end(`Hello from server to the client`);
});

server.addMiddleware("/name", middlewareFive);

server.get("/name/:id", (req, res) => {
  console.log("hello form ", req.name);
  console.log("req.params is ", req.params);
  res.end(`User id is ${req.params.id}`);
});

server.runServerOn(3000, () => {
  console.log("server running on port ", 3000);
});
