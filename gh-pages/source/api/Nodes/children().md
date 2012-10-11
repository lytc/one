    children([String selector]) => nodes

~~~html
<div id="container">
    <div></div>
    <div class="foo"></div>
    <div class="foo bar"></div>
</div>
~~~

~~~js
$('#container').children()
// [<div></div>,<div class="foo"></div>,<div class="foo bar"></div>]

$('#container').children('.foo')
// [<div class="foo"></div>,<div class="foo bar"></div>]
~~~
