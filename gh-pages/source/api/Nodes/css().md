    css(String property) => String
    css(String property, Mixed value) => self
    css(Object properties) => self

~~~html
<div id="foo" style="color: red"></div>
~~~

~~~js
$('#foo').css('color') // => red

$('#foo').css('background-color', 'blue')
// [<div id="foo" style="color: red; background-color: blue"></div>]

$('#foo').css({width: '100px', height: '200px'})
// [<div id="foo" style="color: red; width: 100px; height: 200px"></div>]

$('#foo').css('box-sizing', 'border-box')
// [<div id="foo" style="color: red; -moz-box-sizing: border-box"></div>]
~~~