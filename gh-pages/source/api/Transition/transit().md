    transit(Object properties) => self
    transit(Object properties, Number duration) => self
    transit(Object properties, Number duration, String easing) => self
    transit(Object properties, Function callback) => self
    transit(Object properties, Object options) => self

~~~js
$('.foo').transit({width: 100, height: 100})
$('.foo').transit({width: 100, height: 100}, 2)
$('.foo').transit({width: 100, height: 100}, 2, 'ease-in')
$('.foo').transit({width: 100, height: 100}, function() {
    // do somethings on transition end
})

$('.foo').transit({width: 100, height: 100}, {
    duration: 2
    ,easing: 'ease-in'
    ,callback: function() {
        // do somethings
    }
})