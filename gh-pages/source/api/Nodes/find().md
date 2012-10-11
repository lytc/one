    find([String selector=*]) => nodes

~~~html
<div class="foo">
    <div></div>
    <div class="bar"></div>
    <div class="baz"></div>
</div>
~~~

~~~js
$('.foo').find()
// => [<div></div>,<div class="bar"></div>,<div class="baz"></div>]

$('.foo').find('.bar')
// [<div class="bar"></div>]
~~~