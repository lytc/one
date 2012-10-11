    show([Object options]) => self

~~~js
$('.foo').show(true)
$('.foo').show({
    duration: 2 // 2s
    ,easing: 'ease-in'
    ,callback: function() {
        // do somethings on transition end
    }
})
~~~