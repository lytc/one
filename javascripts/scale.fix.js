if ($.isIphone) {  
  var metaViewport = $('meta[name=viewport]')
  
  metaViewport.attr('content', 'width=device-width, minimum-scale=1.0, maximum-scale=1.0')
  
  $(document).on('gesturestart', function() {
    metaViewport.attr('content', 'width=device-width, minimum-scale=0.25, maximum-scale=1.6')
  })
}
;
