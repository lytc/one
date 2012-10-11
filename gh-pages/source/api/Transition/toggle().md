    toggle([Object options]) => self

~~~js
$('.foo').toggle()
$('.foo').toggle({
    duration: 2 // 2s
    ,easing: 'ease-in'
    ,callback: function() {
        // do somethings on transition end
    }
})
~~~