    moveY(Number y, [Object options]) => self

~~~js
$('.foo').moveY(200)
$('.foo').moveY(200, {
    duration: 2 // 2s
    ,easing: 'ease-in'
    ,callback: function() {
        // do somethings on transition end
    }
})
~~~