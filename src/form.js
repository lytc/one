(function($) {
  $.extend($.nodes.fn, {
    val: function(value, reset) {
      if (undefined === value) {
        var node = this[0]
        
        if (!node) {
          return
        }
        
        if (node.multiple) {
          var options = node.options
              ,value = []
          for (var i = 0, len = options.length; i < len; ++i) {
            if (options[i].selected) {
              value.push(options[i].value)
            }
          }
          return value.length? value : undefined
        }
        
        if ('FORM' == node.nodeName) {
          var value = {}
          $(node.elements).each(function() {
            n = $(this)
            if ((this.type == 'radio' || this.type == 'checkbox') && !this.checked) {
              return
            }
            if (this.type === 'checkbox') {
              if (value[this.name]) {
                value[this.name].push(n.val())
              } else {
                value[this.name] = [n.val()]
              }
            } else {
              value[this.name] = n.val()
            }
          })
          return value
        }
        
        return node.value
      } else {
        this.each(function() {
          var node = this
          if (node.multiple) {
            var options = node.options
            $.isArray(value) || (value = [value])
            
            for (var i = 0, len = value.length; i < len; ++i) {
              value[i] = value[i] + ''
            }
            
            for (var i = 0, len = options.length; i < len; ++i) {
              options[i].selected  = -1 != value.indexOf(options[i].value)
            }
          } else if ('FORM' == node.nodeName) {
            $(node.elements).each(function() {
              n = $(this)
              if (undefined !== value[this.name]) {
                n.val(value[this.name])
              } else if (reset) {
                n.val('')
              }
            })
          } else {  
            switch (node.type) {
              case 'checkbox':
                $.isArray(value) || (value = [value]) 
                node.checked = -1 != value.indexOf(node.value)
                break;
                
              case 'radio':
                node.checked = $(node).val() == value + ''
                break;
                
              default:
                node.value = value
            }      
          }
        })
      }
      
      return this
    }
    ,submit: function(options) {
      if (!this[0] || this[0].nodeName != 'FORM') {
        return this
      }
      
      options || (options = {})
      
      if ($.isFunction(options)) {
        options = {success: options}
      }  
      
      var ajaxOptions = {
        url: this.action || '.'
        ,method: this.method || 'GET'
        ,data: this.first().val()
      }
        
      $.extend(ajaxOptions, options)
      return $.ajax(ajaxOptions)
    }
  })
})(one)