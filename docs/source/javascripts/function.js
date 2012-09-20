(function($) {
  var prototype = {
    createBuffered: function(buffer) {
      var timeoutId
          ,fn = this
          
      return function() {
        var args = arguments
        
        !timeoutId || clearTimeout(timeoutId)
        timeoutId = setTimeout(function() {
          fn.apply(fn, args)
        }, buffer)
      }
    }
    
    ,createRepeated: function(interval) {
      var intervalId
        ,fn = this
        ,result = function() {
          var args = arguments
          
          return intervalId = setInterval(function() {
            fn.apply(fn, args)
          }, interval)
        }
        
        result.stop = function() {
          clearInterval(intervalId)
        }
        
        return result
    }
    
    ,createInterceptor: function(origFn, delay) {
      var fn = this
      return function() {
        var args = arguments
        if (false !== fn.apply(fn, args)) {
          $(function() {
            origFn.apply(origFn, args)
          }).defer(delay | 0)
        }
      }
    }
    
    ,defer: function() {
      var fn = this
      ,args = arguments
      ,miliseconds = [].shift.call(args)
      
      return setTimeout(function() {
        fn.apply(fn, args)
      }, miliseconds)
    }
  }
  $.fn = function(fn) {
    $.extend(fn, prototype)
    return fn
  }
})(one)
