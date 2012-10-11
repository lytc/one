    item(Number index, [Boolean acceptTextNode=false]) => nodes

~~~js
$('<div class="foo"></div>foo<div class="bar"></div>bar').item(1)
// => [<div class="bar"></div>]

$('<div class="foo"></div>foo<div class="bar"></div>bar').item(1, true)
// => ["foo"]
~~~