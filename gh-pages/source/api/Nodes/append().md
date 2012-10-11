    append(String|Array|Node|NodeList|HTMLCollection el*) => self

~~~html
<div class="foo">
    <div class="bar"></div>
</div>
<div class="foo">
</div>
~~~

~~~js
$('.foo').append('<div class="baz"></div>')
~~~

~~~html
<div class="foo">
    <div class="bar"></div>
    <div class="baz"></div>
</div>
<div class="foo">
    <div class="baz"></div>
</div>
~~~