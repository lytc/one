    removeClass(String|Array class*) => self

~~~js
$('<div class="foo bar baz qux"></div>').removeClass('foo bar baz')
$('<div class="foo bar baz qux"></div>').removeClass(['foo', 'bar', 'baz'])
$('<div class="foo bar baz qux"></div>').removeClass('foo', 'bar', 'baz')
$('<div class="foo bar baz qux"></div>').removeClass('foo', ['bar', 'baz'])
// => [<div class="qux"></div>]
~~~