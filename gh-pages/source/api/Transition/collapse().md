    collapse([Object options]) => self

~~~js
$('.foo').collapse()
$('.foo').collapse({
    duration: 2 // 2s
    ,easing: 'ease-in'
    ,callback: function() {
        // do somethings on transition end
    }
})
~~~