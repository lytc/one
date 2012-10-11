    slideUp([Object options]) => self

~~~js
$('.foo').slideUp()
$('.foo').slideUp({
    duration: 2 // 2s
    ,easing: 'ease-in'
    ,callback: function() {
        // do somethings on transition end
    }
})
~~~