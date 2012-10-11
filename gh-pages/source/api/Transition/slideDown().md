    slideDown([Object options]) => self

~~~js
$('.foo').slideDown()
$('.foo').slideDown({
    duration: 2 // 2s
    ,easing: 'ease-in'
    ,callback: function() {
        // do somethings on transition end
    }
})
~~~