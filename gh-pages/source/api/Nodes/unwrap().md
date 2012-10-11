    unwrap() => self

~~~html
<div>
    <div class="foo">
        <div class="bar"></div>
    </div>
</div>
~~~

~~~js
$('.bar').unwrap()
~~~

~~~html
<div>
    <div class="bar"></div>
</div>
~~~