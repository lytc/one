    trigger(String eventName, [Object|CustomEvent e]) => self

~~~js
var nodes = $('<div>')
nodes.on('custom-event', function(e) {
    // do somethings
})
nodes.trigger('custom-event', {bubbles: true, detail: {foo: 1, bar: 2}})
~~~