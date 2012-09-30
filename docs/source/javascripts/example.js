$.ready(function() {
  $('#click-me').on('click', function(e) {
    e.preventDefault()
    alert('Thanks for visiting!')
  })
})