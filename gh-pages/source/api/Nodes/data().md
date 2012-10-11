    data(String property) => String
    data(String property, Mixed value) => self
    data(Object properties) => self

~~~html
<div id="foo" data-value="bar"></div>
~~~

~~~js
$('#foo').data('value') // => bar

$('#foo').data('name', 'baz')
// [<div id="foo" data-value="bar" data-name="baz"></div>]

$('#foo').data({name: 'baz', qux: 1})
// [<div id="foo" data-value="bar" data-name="baz" data-qux="1"></div>]
~~~