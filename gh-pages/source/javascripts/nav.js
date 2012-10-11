$.ready(function() {
    $('.toggle-nav').on('click', function() {
        var aside = $('#container > aside')
        if (aside.height() > 40) {
            aside.transit({height: 30})
        } else {
            aside.transit({height: '100%'})
        }
    })

    $('#container > aside a').on('click', function() {
        $('#container > aside').transit({height: 30})
    })
})