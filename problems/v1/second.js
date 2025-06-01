/*

our second problem is related to middleware execution logic what i mean to say 
is runsOneveryRequest currently build up and executes middleware manually

Currently our middleware execution logic looks like this -> 

*/

async function runsOnEveryRequest(req, res) {
  const stack = middlewareStack.get(req.path) || [];
  let index = 0;

  function next(err) {
    const fn = stack[index++];
    if (!fn) return;

    try {
      fn(req, res, next);
    } catch (e) {
      next(e);
    }
  }

  next();
}

/*
frankly speaking it looks simple but but,
   1 what if a middleware never calls next() ??
   2 what about async middlewares

   and to handle async things we need to add something like this 
*/

try {
  const result = fn(req, res, next);
  if (result && typeof result.then === "function") {
    await result;
  }
} catch (e) {}

/*
  
  So the problem is runsOnEveryRequest handles flows,errors, and bussiness logic

  also adding features like timeout, early bailout or logging becomes messy
  also we cant test this ( we need to test the whole runsOnEveryRequest ) ,
  one more thing is that we cant use it elseware
  
*/

/*

Here solution is compose ( or something like compose ) which looks like this 

*/

function compose(middlewares) {
  return function (req, res, next) {
    let index = -1;
    function dispatch(i) {
      if (i <= index)
        return Promise.reject(new Error("next() called multiple times"));
      index = i;

      const fn = middlewares[i];
      if (!fn) return Promise.resolve();

      try {
        return Promise.resolve(fn(req, res, () => dispatch(i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return dispatch(0)
      .then(() => next && next())
      .catch((err) => {
        if (next) return next(err);
        throw err;
      });
  };
}

const runMiddleware = compose(middlewareStack.get(path));

function runsOnEveryRequest(req, res) {
  runMiddleware(req, res, finalHandler);
}

/*

Overall , compose function takes an array of middleware and returns a composed
function that handles all chaining, also this handles sync and async middlewares , 
errors , protects from infinite loop 

now we can write unit test for compose alone
also our runsOnEveryRequest only composes and runs
we now dont need to repeat execution logic everywhere just compose things

Can be tested like this ->

*/

const stack = [
  async (req, res, next) => {
    req.a = 1;
    await next();
    req.c = 3;
  },
  async (req, res, next) => {
    req.b = 2;
    await next();
  },
];

const composed = compose(stack);
const req = {},
  res = {};

await composed(req, res);

console.log(req); // { a: 1, b: 2, c: 3 }
