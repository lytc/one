    offset() => Object
    offset(Object properties) => self

~~~js
$('<div style="width: 100px; height: 200px; top: 300px; left: 400px"></div>').offset()
// => {width: 100, height: 200, top: 300, left: 400}

$('<div></div>').offset({width: 100, height: 200, top: 300, left: 400})
// => [<div style="width: 100px; height: 200px; top: 300px; left: 400px"></div>]
~~~