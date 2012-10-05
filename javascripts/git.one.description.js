$.ready(function() {
    $.getJsonP('https://api.github.com/repos/lytc/one', function(result) {
        $('#description').html(result.data.description)
    })
})
;
