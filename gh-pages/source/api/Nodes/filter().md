    filter(Function callback) => nodes

~~~html
<div class="foo">1</div>
<div class="foo">2</div>
<div class="foo">3</div>
<div class="foo">4</div>
~~~

~~~js
$('.foo').filter(function() {
    return ~~$(this).html() % 2 == 0
})

// => [<div class="foo">2</div>,<div class="foo">4</div>]
~~~