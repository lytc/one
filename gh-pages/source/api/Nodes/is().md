    is(String selector) => Boolean
    is(Node) => Boolean
    is(NodeList|HtmlCollection items) => Boolean

~~~js
$('<div>').is('div') // true
$('<div class="foo"></div>').is('div.foo') // true
~~~