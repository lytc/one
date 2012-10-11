    next([String selector=*]) => nodes

~~~html
<div>
    <div class="foo"></div>
    <div class="bar"></div>
    <div class="baz"></div>
</div>
~~~

~~~js
$('.foo').next()
// [<div class="bar"></div>]

$('.foo').next('.baz')
// []
~~~