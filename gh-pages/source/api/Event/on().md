    on(String eventName, [String selector], Function callback, [Number limit=-1]) => self

~~~js
$('.foo').on('click', function(e) {
    // do somethings
})

$('.foo').on('click', '.bar', function(e) {
    // do somethings
})
~~~