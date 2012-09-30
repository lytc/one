(function($) {
  var Arr = function(arr) {
    $.extend(arr, Arr.fn)
    return arr
  }
  
  Arr.fn = {
    pad: function(size, value) {
      if (size > 0) {
        for (var i = 0, len = size - this.length; i < len; ++i) {
          this.push(value)
        }
      } else {
        for (var i = 0, len = -size - this.length; i < len; ++i) {
          this.unshift(value)
        }
      }
        
      return this
    }
      
    ,padLeft: function(size, value) {
      return this.pad(-size, value)
    }
      
    ,uniq: function() {
      var result = []
      for (var i = 0, len = this.length; i < len; ++i) {
        if (-1 == result.indexOf(this[i])) {
          result.push(this[i])
        }
      }
        
      return $.arr(result)
    }
      
    ,truthy: function() {
      var result = this.filter(function(item) {
        return !!item
      })
      return $.arr(result)
    }
      
    ,falsy: function() {
      var result = this.filter(function(item) {
        return !item
      })
      return $.arr(result)
    }
      
    ,exclude: function() {
      var arg, index
      for (var i = 0, len = arguments.length; i < len; ++i) {
        arg = $.isArray(arguments[i])? arguments[i] : [arguments[i]]
        for (var j = 0, jlen = arg.length; j < jlen; ++j) {
          if (-1 != (index = this.indexOf(arg[j]))) {
            this.splice(index, 1)
          }
        }
      }
      return this
    }
      
    ,toArray: function() {
      var result = []
      for (var i = 0, len = this.length; i < len; ++i) {
        result.push(this[i])
      }
      return result
    }
  }
  $.arr = Arr
})(one)