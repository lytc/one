    hasClass(String|Array class*) => Boolean

~~~js
var nodes = $('<div class="foo bar baz"></div>')

nodes.hasClass('foo') // => true
nodes.hasClass('foo bar') // => true
nodes.hasClass('foo', 'bar') // => true
nodes.hasClass(['foo', 'bar']) // => true
nodes.hasClass('foo', ['bar', 'baz']) // => true
~~~