    index() => Number

~~~html
<div>
    <div class="foo"></div>
    <div class="bar"></div>
    <div class="baz"></div>
</div>
~~~

~~~js
$('.foo').index() // => 0
$('.bar').index() // => 1
$('.baz').index() // => 2
~~~