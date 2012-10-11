    moveX(Number x, [Object options]) => self

~~~js
$('.foo').moveX(200)
$('.foo').moveX(200, {
    duration: 2 // 2s
    ,easing: 'ease-in'
    ,callback: function() {
        // do somethings on transition end
    }
})
~~~