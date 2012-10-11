    prev([String selector=*]) => nodes

~~~html
<div>
    <div class="foo"></div>
    <div class="bar"></div>
    <div class="baz"></div>
</div>
~~~

~~~js
$('.baz').prev()
// [<div class="bar"></div>]

$('.baz').next('.foo')
// []
~~~