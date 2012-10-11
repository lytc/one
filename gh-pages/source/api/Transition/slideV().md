    slideV([Object options]) => self

~~~js
$('.foo').slideV()
$('.foo').slideV({
    duration: 2 // 2s
    ,easing: 'ease-in'
    ,callback: function() {
        // do somethings on transition end
    }
})
~~~