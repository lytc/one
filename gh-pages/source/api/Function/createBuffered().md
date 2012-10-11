    Function.prototype.createBuffered([Number buffer]) => Function

~~~js
var callback = function() {
    console.log('Hello!')
}

var buffered = callback.createBuffered()
buffered()
buffered()

// => 'Hello'
~~~