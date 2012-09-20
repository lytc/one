(function($) {
  var Str = function(str) {
    this.str = str + ''
  }
    
  $.extend(Str.prototype, {
    toString: function() {
      return this.str
    }
      
    ,camelize: function() {
      str = this.str.replace(/[-_\s]+(.)?/g, function(match, c){ 
        return c.toUpperCase() 
      })
      return new Str(str)
    }
        
    ,underscore: function() {
      str = this.str.replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase()
      return new Str(str)
    }
        
    ,dasherize: function() {
      str = this.str.replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase()
      return new Str(str)
    }
  })
  
  $.str = function(str) {   
    return new Str(str)
  }
})(one)