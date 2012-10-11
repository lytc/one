    submit(Function callback) => self
    submit(Object options) => self

~~~js
$('form').submit(function(result) {
    // do somethings
})
$('form').submit({
    url: 'submit.php'
    ,onSuccess: function(result) {
        // do somethings
    }
})
~~~