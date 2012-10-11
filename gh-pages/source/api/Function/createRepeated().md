    Function.prototype.createRepeated(Number interval) => Function

~~~js
var callback = function() {
    console.log(new Date().getSeconds())
}

var repeater = callback.createRepeated(1000)
repeater()

// 1
// 2
// 3
//...
~~~