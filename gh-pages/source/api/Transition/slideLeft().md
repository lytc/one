    slideLeft([Object options]) => self

~~~js
$('.foo').slideLeft()
$('.foo').slideLeft({
    duration: 2 // 2s
    ,easing: 'ease-in'
    ,callback: function() {
        // do somethings on transition end
    }
})
~~~