    parent([String selector=*]) => nodes

~~~html
<div class="foo">
    <div class="baz"></div>
</div>
<div class="bar">
    <div class="baz"></div>
</div>
~~~

~~~js
$('.baz').parent()
// => [<div class="foo">...</div>,<div class="bar">...</div>]

$('.baz').parent('.foo')
// => [<div class="foo">...</div>]
~~~