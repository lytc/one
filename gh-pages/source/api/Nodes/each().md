    each(Function callback) => self

~~~html
<div class="foo"></div>
<div class="foo"></div>
~~~

~~~js
$('.foo').each(function(index) {
    $(this).html(index)
})

// => [<div class="foo">0</div>,<div class="foo">1</div>]
~~~