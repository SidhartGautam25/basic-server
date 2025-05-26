/*

Now we will discuss factory pattern and how we can implement this in our current
library and understand how this will imporve our library


first lets understand what is factory pattern
       -->  A factory function is a function that creates and returns new, 
            fully-initialized application instances — without needing new.

Something like this --> 
*/

function createApp(opts = {}) {
  const app = new BasicServer(opts);

  // Attach any default config, plugins, logging, etc.
  app.set("name", "MyApp");
  return app;
}
/*

With createApp(), you control what gets initialized every time, and you can evolve
the system without exposing class internals.

With a class-only model (new BasicServer()), you’re either forced to:
     1. pass that shared state/config into every constructor manually
     2. or (bad practice) store it globally, which kills testability and modularity.

*/

/*

Another problem with current design is lack of control over how the app is 
created

Suppose tomorrow you want to:
        Inject dependencies
        Preload routes
        Setup monitoring hooks
        Setup plugins
        Add default middleware

With a class-based approach, you’d need to expose more and more of the constructor.

But with factory some like this works 
*/

function createApp(options) {
  const app = new BasicServer();

  if (options.enableMonitoring) {
    app.addMiddleware(monitoringMiddleware);
  }

  return app;
}

/*

There are more benefits with factory pattern will provide and we will 
discuss it later

*/
