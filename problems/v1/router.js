// Here we will discuss the problem with our current router class

/*

Currently we have hardcoded http methods , we can do something like this

*/

Object.keys(method_number).forEach((method) => {
  if (method) this[method.toLowerCase()] = this.add.bind(this, method);
});

/*

logic for temp.key and matches.groups is repetitive so we can refactor it 
into helper functions

*/
