    Function.prototype.createInterceptor(Function passedFn) => Function

~~~js
var callback = function(name) {
    console.log(name)
}

var interceptor = callback.createInterceptor(function() {
    console.log('Hello ')
})

interceptor('One.js')

// => Hello
// => One.js
~~~