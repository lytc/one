    addClass(String|Array class*) => self

~~~js
var div = document.createElement('div')

$(div).addClass('foo bar')
$(div).addClass('foo', 'bar')
$(div).addClass(['foo', 'bar'])
// => [<div class="foo bar"></div>]
~~~