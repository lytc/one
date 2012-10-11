    toggleClass(String|Array class*) => self

~~~js
$('<div class="foo"></div>').toggleClass('foo bar baz')
$('<div class="foo"></div>').toggleClass(['foo', 'bar', 'baz'])
$('<div class="foo"></div>').toggleClass('foo', 'bar', 'baz')
$('<div class="foo"></div>').toggleClass('foo', ['bar', 'baz'])

// => [<div class="bar baz"></div>]
~~~
