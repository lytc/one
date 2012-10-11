    top() => Number
    top(Number top) => self

~~~js
$('<div style="top: 100px"></div>').top()
// => 100

$('<div style="top: 100px"></div>').top(200)
// => [<div style="top: 200px"></div>]

$('<div style="top: 100px"></div>').top('100pt')
// => [<div style="top: 100pt"></div>]

$('<div style="top: 100px"></div>').top('auto')
// => [<div style="top: auto"></div>]
~~~