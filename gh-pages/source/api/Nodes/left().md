    left() => Number
    left(Number|String left) => self

~~~js
$('<div style="left: 100px"></div>').left()
// => 100

$('<div style="left: 100px"></div>').left(200)
// => [<div style="left: 200px"></div>]

$('<div style="left: 100px"></div>').left('100pt')
// => [<div style="left: 100pt"></div>]

$('<div style="left: 100px"></div>').left('auto')
// => [<div style="left: auto"></div>]
~~~

