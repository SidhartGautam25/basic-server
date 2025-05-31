// in this we will understand find method of router class in detail

/*


Overall find takes two things as argument 
   -> first is a method,and second is a url
   -> now in our router class there is a router array which stores router object
   -> this router object has fields like keys,pattern,method,handlers
   -> also,this find returns a object which has two things
       -> handlers and params

   -> now when a url and a method is given we loop through this routes 
      array and matches the method of the routerObject with the method
      given to this find 

   -> now if method matches,then there are four things that can happen

   first, the provided url is a static url which means it cant have a params
   things ( ex : '/user')

   In this case we need to do this -> 
*/
// first we are checking the url with the pattern
// and if it matches then we only returns handlers as this has no params things
// as it is a static url
// about pattern.test -> Unlike .exec(), .test() just returns true/false
//                       (no captured groups).
if (temp.pattern.test(url)) {
  if (temp.handlers.length > 1) {
    handlers = handlers.concat(temp.handlers);
  } else {
    handlers.push(temp.handlers[0]);
  }
}

/*

Now second case is when url is something like this '/users/:id' things
and for this we do this 


*/
if (temp.key.length > 0) {
  matches = temp.pattern.exec(url);
  if (matches === null) {
    //continue;
  }
  for (j = 0; j < temp.key.length; j++) {
    params[temp.key[j]] = matches[j];
  }
  if (temp.handlers.length > 1) {
    handlers = handlers.concat(temp.handlers);
  } else {
    handlers.push(temp.handlers[0]);
  }
} else if (temp.key.length > 0) {
  /*

when the routerObject has key thing,then we need to check if the route 
has :param keys (e.g., ["id", "slug"]).

For /user/123, matches will be:
["/user/123", "123"] // Index 0: full match, Index 1+: captured groups

*/
  matches = temp.pattern.exec(url);
  if (matches === null) {
    // continue;
  }
  for (j = 0; j < temp.key.length; j++) {
    params[temp.key[j]] = matches[j];
  }
  // if handlers length is greater than one,then handlers will have
  // all those handlers
  if (temp.handlers.length > 1) {
    handlers = handlers.concat(temp.handlers);
  } else {
    // if size is 1 just push the first handler to it
    handlers.push(temp.handlers[0]);
  }
}

/*

-> Now third case deals with named groups
-> temp.key === false
        --> Indicates the route was defined using regex named groups 
            ((?<name>pattern)) instead of :param syntax.


When a regex has named groups (e.g., /(?<id>[0-9]+)/), exec() returns a groups object
like { id: "123" }.

*/

if (temp.key === false) {
  matches = temp.pattern.exec(url);
  if (matches === null) {
    // continue;
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
}
