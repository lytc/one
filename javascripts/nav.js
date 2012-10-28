$.ready(function() {
    $('.toggle-nav').on('click', function() {
        var aside = $('#container > aside')
        if (aside.height() > 40) {
            aside.transit({height: 30}, function() {
                $(this).css('height', null).css('transition', null)
            })
        } else {
            aside.transit({height: '100%'})
        }
    })

    $('#container > aside a').on('click', function() {
        if ($('.toggle-nav').css('display') == 'none') {
            return;
        }
        $('#container > aside').transit({height: 30}, function() {
            $(this).css('height', null).css('transition', null)
        })
    })
})
;
