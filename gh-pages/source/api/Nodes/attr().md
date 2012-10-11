    attr(String name) => String
    attr(String name, Mixed value) => self
    attr(Object attrs) => self

~~~html
<input type="text" name="email" value="prtran@gmail.com">
~~~

~~~js
$('input').attr('name') // => email

$('input').attr('value', 'anonymous@gmail.com')
// => [<input type="text" name="email" value="anonymous@gmail.com">]

$('input').attr({name: 'foo', value: 'bar'})
// => [<input type="text" name="foo" value="bar">]
~~~