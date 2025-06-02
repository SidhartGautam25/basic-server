/*


We will discuss the problem with our current code design,and for now we will
focus on the middlewares things and problem with them.

first of all we need to understand the fact that we should not directly mutate
internal properties like this.middleware[base] from outside the middlewareManager
( for now we dont even have a middleware manager ) .

Instead , we should encapsulate internal state like middleware lists inside a 
dedicated class or module ( let say middlewreStack ) that exposes safe and
clean  methods like .register() and others.

*/

this.middlewares[base] = [...(this.middlewares[base] || []), ...callbacks];

/*

Problem with above code 

1. Direct mutation of middlewares object from multiple places.
2. Mixing middleware logic inside BasicServer, which should ideally only 
   manage server behavior.
3. Tight coupling between request handling and middleware storage format
4. Difficult to enforce constraints, logging, ordering, or plugin support in future.
5. Harder to test or reuse the middleware logic in other components (like a sub-router
   or plugin system).

There should be something like this -->
*/

class MiddlewareStack {
  constructor() {
    this.middlewares = new Map(); // basePath => [middlewareFns]
  }

  register(basePath = "/", ...handlers) {
    const existing = this.middlewares.get(basePath) || [];
    this.middlewares.set(basePath, [...existing, ...handlers]);
  }

  getForPath(pathname) {
    const matched = [];

    for (const [base, fns] of this.middlewares.entries()) {
      if (pathname.startsWith(base)) {
        matched.push(...fns);
      }
    }

    return matched;
  }

  flattenAll() {
    return [...this.middlewares.values()].flat();
  }
}

/*

Now this is better than the current design as internal state is safely hidden 
inside the middlewareStack class

middlewareStack does one thing -> managing the middleware

can reuse the middlewareStack at multiple level like for subapp,router etc

can easily add new methods and can change the middleware logic without affecting 
callers and this is very very important as if our codebase grows and if we need
to change the logic then we have to manually go to each place where middleware 
logic is written but in this way our middleware logic is centralized




*/
