    ancestors([Number level], String selector) => nodes

Using the following HTML:

~~~html
<div class="foo">
    <div class="bar">
        <div class="baz">
            <div class="qux"></div>
        </div>
    </div>
</div>
~~~

~~~js
$('.qux').ancestors('.bar')
=> [<div class="bar"></div>]

$('.div').ancestors(2, '.foo')
=> [<div class="bar"></div>]
~~~
