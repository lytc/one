    prepend(String|Array|Node|NodeList|HTMLCollection els) => self

~~~html
<div class="foo">
    <div class="bar"></div>
</div>
~~~

~~~js
$('.foo').prepend('<div class="baz"></div>')
~~~

~~~html
<div class="foo">
    <div class="bar"></div>
    <div class="baz"></div>
</div>
~~~