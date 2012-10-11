    first([Boolean acceptTextNode=false]) => nodes

~~~js
var nodes = $('text content<div class="foo"></div>')

nodes.first()
// [<div class="foo"></div>]

node.first(true)
// ["text content"]
~~~
