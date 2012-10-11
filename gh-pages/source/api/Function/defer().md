    Function.prototype.defer([Number miliseconds]) => Int

~~~js
var callback = function() {
    console.log('One.js')
}

callback.defer(1)
console.log('Hello')

// Hello
// One.js
~~~