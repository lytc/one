    un(String eventName, [String selector], [Function callback]) => self

~~~js
var nodes = $('<div>')
var callback = function(e) {
   // do somethings
}
nodes.on('click', callback)
nodes.un('click', callback)
nodes.un('click')

node.on('click', '.foo', function() {
    // do somethings
})
node.un('click', '.foo')
~~~