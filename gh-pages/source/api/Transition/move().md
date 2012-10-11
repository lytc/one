    move(Number x, Number y, [Object options]) => self

~~~js
$('.foo').move(200, 200)
$('.foo').move(200, 200, {
    duration: 2 // 2s
    ,easing: 'ease-in'
    ,callback: function() {
        // do somethings on transition end
    }
})
~~~