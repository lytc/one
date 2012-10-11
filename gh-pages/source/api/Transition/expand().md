    expand([Object options]) => self

~~~js
$('.foo').expand()
$('.foo').expand({
    duration: 2 // 2s
    ,easing: 'ease-in'
    ,callback: function() {
        // do somethings on transition end
    }
})
~~~