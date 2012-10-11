    prevSiblings([String selector=*]) => nodes

~~~html
<div>
    <div class="foo"></div>
    <div class="bar"></div>
    <div class="baz"></div>
</div>
~~~

~~~js
$('.baz').prevSiblings()
// [<div class="foo"></div>,<div class="bar"></div>]

$('.baz').prevSiblings('.foo')
// [<div class="foo"></div>]
~~~