(function($) {
  var transitionEndEventName = 'transitionend'
  if ($.isWebkit) {
    transitionEndEventName = 'webkitTransitionEnd'
  }
  
  $.extend($.node.prototype, {
    transit: function(properties, duration, easing, callback) {
      var node = this.nodes[0]
      if (!node) {
        return this
      }
      node.fxQueue || (node.fxQueue = [])
      
      if (node.isFxPlaying) {
        node.fxQueue.push([properties, duration, easing, callback])
        return this
      }
      
      node.isFxPlaying = true
      
      var options = {}
      
      if ($.isPlainObject(duration)) {
        options = duration
      } else {
        if ($.isFunction(duration)) {
          callback = duration
          duration = undefined
        }
        !duration || (options.duration = duration)
        !easing   || (options.easing = easing)
        !callback || (options.callback = callback)
      }
      
      options = $.extend({
        duration: .5
        ,easing: 'ease'
        ,delay: 0
      }, options)
      
      var me = this
      this.one(transitionEndEventName, function(e) {
        !callback || options.callback.call(e.target, e, me)
        
        node.isFxPlaying = false
        var args = node.fxQueue.shift()
        if (args) {
          me.transit.apply(me, args)
        }
      })
      
      var keys = Object.keys(properties)
          ,len = keys.length
      
      var transitionProperty      = keys.join()
        ,transitionDuration       = $.arr([]).pad(len, options.duration + 's')
        ,transitionTimingFunction = $.arr([]).pad(len, options.easing)
        ,transitionDelay          = $.arr([]).pad(len, options.delay + 's')
        ,fixFirefox               = false
        ,has                      = properties.hasOwnProperty.bind(properties)
        ,hasLeft                  = has('left')
        ,hasTop                   = has('top')
        ,hasRight                 = has('right')
        ,hasBottom                = has('bottom')
        ,hasWidth                 = has('width')
        ,hasHeight                = has('height')
        
      this.each(function() {
        var el = $(this)
          ,value
          ,newValue
          ,originalSize
        
        for (var i in properties) {
          if (-1 != ['width', 'height', 'left', 'top', 'right', 'bottom'].indexOf(i)) {
            value = properties[i]
            ,matches = ('' + value).match(/^(\+|\-|\*|\/)=(\d+)/)
            
            if (matches) {
              originalSize = parseFloat(el.css(i))
              !isNaN(originalSize) || (originalSize = 0)
              
              newValue = parseFloat(matches[2])
              
              switch (matches[1]) {
                case '+':
                  value = originalSize + newValue
                  break;
                  
                case '-':
                  value = originalSize - newValue
                  break;
                  
                case '*':
                  value = originalSize * newValue
                  break;
                    
                case '/':
                  value = originalSize / newValue
                  break;
              }
            }
            
            properties[i] = $.isNumber(value)? value + 'px' : value
          }
        }
        
        if ($.isFirefox && (el.css('left') == 'auto' || el.css('top') == 'auto')) {
          fixFirefox = true
          el.css({
            left: 0 + 'px'
            ,top: 0 + 'px'
          })
        }
        
        if ((hasLeft || hasTop || hasRight || hasBottom) && (-1 == ['relative', 'absolute', 'fixed'].indexOf(el.css('position')))) {
          el.css('position', 'relative')
        }
        
        if (hasWidth || hasHeight) {
          el.css('overflow', 'hidden')
        }
        
        el.css({
          transitionProperty: transitionProperty
          ,transitionDuration: transitionDuration
          ,transitionTimingFunction: transitionTimingFunction
          ,transitionDelay: transitionDelay
        })
        
        $(el.css.bind(el)).defer(fixFirefox? 10 : 0, properties)
      })
      
      return this
    }
    
    ,show: function(options) {
      if ($.isFunction(options)) {
        options = {callback: options}
      } else if ($.isNumber(options)) {
        options = {duration: options}
      } else if (true === options) {
        options = {}
      }
      
      if (undefined === options) {
        this.css({
          display: 'inherit'
          ,opacity: 1
        })
      } else {
        this.transit({opacity: 1}, options)
      }
      return this
    }
    
    ,hide: function(options) {
      if ($.isFunction(options)) {
        options = {callback: options}
      } else if ($.isNumber(options)) {
        options = {duration: options}
      } else if (true === options) {
        options = {}
      }
      
      if (undefined === options) {
        this.css('display', 'none')
      } else {
        this.transit({opacity: 0}, options)
      }
      
      return this
    }
    
    ,toggle: function(options) {
      this.each(function() {
        var el = $(this)
        el[el.css('display') == 'none' || el.css('opacity') == 0? 'show' : 'hide'](options)
      })
      return this
    }
    
    ,slideUp: function(options) {
      this.each(function(node) {
        var el = $(node)
        node.originalHeight = el.css('height')
        el.transit({height: 0}, options)
      })
      return this
    }
    
    ,slideDown: function(options) {
      this.each(function(node) {
        if (!node.originalHeight) {
          return
        }
        
        $(node).transit({height: node.originalHeight}, options)
        node.originalHeight = undefined
      })
      return this
    }
    
    ,slideLeft: function(options) {
      this.each(function(node) {
        var el = $(node)
        node.originalWidth = el.css('width')
        el.transit({width: 0}, options)
      })
      return this
    }
    
    ,slideRight: function(options) {
      this.each(function(node) {
        if (!node.originalWidth) {
          return
        }
        
        $(node).transit({width: node.originalWidth}, options)
        node.originalWidth = undefined
      })
      return this
    }
    
    ,slideVertical: function(options) {
      this.each(function(node) {
        $(node)[node.originalHeight? 'slideDown' : 'slideUp'](options)
      })
      return this
    }
    
    ,slideHorizontal: function(options) {
      this.each(function(node) {
        $(node)[node.originalWidth? 'slideRight' : 'slideLeft'](options)
      })
      return this
    }
    
    ,collapse: function(options) {
      this.each(function(node) {
        var el = $(node)
        node.originalHeight = el.css('height')
        node.originalWidth = el.css('width')
        el.transit({height: 0, width: 0}, options)
      })
      return this
    }
    
    ,expand: function(options) {
      this.each(function(node) {
        if (!node.originalHeight && !node.originalWidth) {
          return
        }
        
        $(node).transit({height: node.originalHeight, width: node.originalWidth}, options)
        node.originalHeight = undefined
        node.originalWidth = undefined
      })
      return this
    }
    
    ,toggleCollapse: function(options) {
      this.each(function(node) {
        $(node)[node.originalHeight && node.originalWidth? 'expand' : 'collapse'](options)
      })
      return this
    }
    
    ,moveX: function(x, options) {
      return this.transit({
        left: x
      }, options)
    }
    
    ,moveY: function(y, options) {
      return this.transit({
        top: y
      }, options)
    }
    
    ,move: function(x, y, options) {
      return this.transit({
        left: x
        ,top: y
      }, options)
    }
  })
})(one)
