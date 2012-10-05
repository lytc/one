$.ready(function() {
    $.getJson('https://api.github.com/repos/lytc/one', function(result) {
        $('#description').html(result.description)
    })
})