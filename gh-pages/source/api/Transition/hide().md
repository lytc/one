    hide([Object options]) => self

~~~js
$('.foo').hide(true)
$('.foo').hide({
    duration: 2 // 2s
    ,easing: 'ease-in'
    ,callback: function() {
        // do somethings on transition end
    }
})
~~~