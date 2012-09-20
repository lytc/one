(function($) {
  $.arr = function(arr) {
    $.extend(arr, {
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
      
      ,toArray: function() {
        var result = []
        for (var i = 0, len = this.length; i < len; ++i) {
          result.push(this[i])
        }
        return result
      }
    })
    return arr
  }
})(one)