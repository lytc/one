    nextSiblings([String selector=*]) => nodes

~~~html
<div>
    <div class="foo"></div>
    <div class="bar"></div>
    <div class="baz"></div>
</div>
~~~

~~~js
$('.foo').nextSiblings()
// [<div class="bar"></div>,<div class="baz"></div>]

$('.foo').nextSiblings('.baz')
// [<div class="baz"></div>]
~~~