    height() => Number
    height(String|Number height) => self

~~~js
var nodes = $('<div></div>')

nodes.height('100px')
// => [<div style="height: 100px"></div>]

nodes.height(200)
// => [<div style="height: 200px"></div>]

nodes.height()
// => 200
~~~