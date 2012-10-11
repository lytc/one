    after(String|Array|Node|NodeList|HtmlCollection el) => self

Using the following HTML:

~~~html
<div>
    <div class="foo">item</div>
    <div class="foo">item</div>
    <div class="foo">item</div>
</div>
~~~

Insert after each div.foo:

~~~js
$('.foo').after('<p>test</p>')
~~~

Each div.foo element gets the new content:

~~~html
<div>
    <div class="foo">item</div>
    <p>test</p>
    <div class="foo">item</div>
    <p>test</p>
    <div class="foo">item</div>
    <p>test</p>
</div>
~~~