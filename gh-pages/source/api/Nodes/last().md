    last([Boolean acceptTextNode=false]) => nodes

~~~js
$('<div class="foo"></div>foo<div class="bar"></div>bar').last()
// => [<div class="bar"></div>]

$('<div class="foo"></div>foo<div class="bar"></div>bar').last(true)
// => ["foo"]
~~~