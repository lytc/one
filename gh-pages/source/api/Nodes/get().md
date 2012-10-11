    get(Number index, [Boolean acceptTextNode]) => nodes

~~~js
var nodes = $('text content<div class="foo"></div>')

nodes.get(0)
// [<div class="foo"></div>]

nodes.get(0, true)
// ["text content"]
~~~