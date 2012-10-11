    wrap([String|Node el=<div>]) => self

~~~html
<div>
    <div class="bar"></div>
</div>
~~~

~~~js
$('.bar').wrap('<div class="foo"></div>')
~~~

~~~html
<div>
    <div class="foo">
        <div class="bar"></div>
    </div>
</div>
~~~