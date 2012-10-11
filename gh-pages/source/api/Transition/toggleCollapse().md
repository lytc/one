    toggleCollapse([Object options]) => self

~~~js
$('.foo').toggleCollapse()
$('.foo').toggleCollapse({
    duration: 2 // 2s
    ,easing: 'ease-in'
    ,callback: function() {
        // do somethings on transition end
    }
})
~~~