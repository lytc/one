(function($) {
  var NodeList = function(nodes) {
    if ($.isNode(nodes)) {
      nodes = [nodes]
    }
    
    if (!$.isArray(nodes)) {
      nodes = $.toArray(nodes)
    }
    
    this.nodes = nodes
  }
  
  $.extend(NodeList.prototype, {
    index: function() {
      if (!this.nodes[0]) {
        return -1
      }
      
      return [].indexOf.call(this.nodes[0].parentElement.children, this.nodes[0])
    }
    
    ,get: function(index) {
      index > -1 || (index = this.nodes.length + index)
      return this.nodes[index]
    }
    
    ,item: function(index) {
      return new NodeList(this.get(index))
    }
    
    ,first: function() {
      return this.item(0)
    }
    
    ,last: function() {
      return this.item(-1)
    }
    
    ,ancestors: function(level, selector) {
      if ($.isString(level)) {
        selector = level
        level = 1
      }
      
      undefined !== level || (level = 1)
      
      var nodes = []
          ,count
          ,parent
          
      this.each(function() {
        count = level
        parent = this
        
        while (count != 0) {
          parent = parent.parentNode
          if (!parent) {
            return
          }
          count--
        }
        
        if (selector) {
          if ($(parent).is(selector)) {
            nodes.push(parent)
          }
        } else {
          nodes.push(parent)
        }
      })
      
      return new NodeList(nodes)
    }
    
    ,parent: function(selector) {
      return this.ancestors(selector)
    }
    
    ,each: function(callback) {
      this.nodes.forEach(function(node, index, nodes) {
        return callback.call(node, node, index, nodes)
      })
      return this
    }
    
    ,filter: function(callback) {
      return new NodeList(this.nodes.filter(callback))
    }
    
    ,matches: function(selector) {
      return this.filter(function(node) {
        return node[$.vendorPrefix? $.vendorPrefix + 'MatchesSelector' : 'matchesSelector'](selector)
      })
    }
    
    ,is: function(what) {
      if ($.isString(what)) {
        return !!this.matches(what).nodes.length
      }
      
      if ($.isElement(what)) {
        what = [what]
      }
      
      if ($.isLikeArray(what)) {
        for (var i = 0, len = what.length; i < len; ++i) {
          if (-1 != this.nodes.indexOf(what[i])) {
            return true
          }
        }
      }
      return false
    }
    
    ,find: function(selector) {
      selector || (selector = '*')
      var nodes = []
      this.each(function() {
        [].forEach.call($.query(selector, this), function(n) {
          nodes.push(n)
        })
      })
      return new NodeList(nodes)
    }
    
    ,children: function(selector) {
      selector || (selector = '*')
      return this.find('>' + selector)
    }
    
    ,next: function(selector) {
      selector || (selector = '*')
      return this.find('+' + selector)
    }
    
    ,prev: function(selector) {
      selector || (selector = '*')
      return this.find('-' + selector)
    }
    
    ,nextSiblings: function(selector) {
      selector || (selector = '*')
      return this.find('~' + selector)
    }
    
    ,prevSiblings: function(selector) {
      selector || (selector = '*')
      return this.find('<~' + selector)
    }
    
    ,append: function(what) {
      if ($.isString(what)) {
        this.each(function() {
          this.innerHTML += what
        })
      } else {
        this.each(function(node) {
          $(what).each(function(n) {
            node.appendChild(n)
          })
        })
      }
      return this
    }
    
    ,prepend: function(what) {
      if ($.isString(what)) {
        this.each(function() {
          this.innerHTML = what + this.innerHTML
        })
      } else {
        this.each(function(node) {
          what.each(function(n) {
            node.insertBefore(n, node.firstElementChild)
          })
        })
      }
      return this
    }
    
    ,before: function(el) {
      this.each(function() {
        this.parentElement.insertBefore($(el).nodes[0], this)
      })
      return this
    }
    
    ,after: function(el) {
      this.each(function() {
        this.parentElement.insertBefore($(el).nodes[0], $(this).next().nodes[0])
      })
      return this
    }
    
    ,clone: function() {
      var node
      return $.map(this.nodes, function() {
        node = this.cloneNode(true)
        node.removeAttribute('id')
        return node
      })
    }
    
    ,concat: function() {
      var me = this
      
      $.each(arguments, function(index, item) {
        if ($.isString(item)) {
          me.concat.apply(me, $.query(item))
        } else if ($.isLikeArray(item)) {
          me.concat.apply(me, item)
        } else if (item instanceof NodeList) {
          me.concat.apply(me, item.nodes)
        } else if ($.isElement(item)) {
          me.nodes.push(item)
        }
      })
      
      return this
    }
    
    ,wrap: function(el) {
      var tmp
      this.each(function(node) {
        node = $(node)
        tmp = $(el)
        node.before(tmp)
        tmp.append(this)
      })
      return this
    }
    
    ,unwrap: function() {
      var parent
      this.each(function() {
        parent = this.parentElement
        $(parent.childNodes).each(function() {
          $(parent).before(this)
        })
        $(parent).destroy()
      })
    }
    
    ,destroy: function() {
      this.each(function() {
        this.parentNode.removeChild(this)
      })
    }
    
    ,html: function(html) {
      if (undefined === html) {
        var node = this.nodes[0]
        if (node) {
          return node.innerHTML
        }
      } else {
        this.each(function() {
          this.innerHTML = html
        })
      }
      return this
    }
    
    ,text: function(text) {
      if (undefined === text) {
        var node = this.nodes[0]
        if (node) {
          return node.textContent
        }
      } else {
        this.each(function() {
          this.textContent = text
        })
      }
      return this
    }
    
    ,data: function(name, value) {
      if (!this.nodes[0]) {
        return
      }
      
      if (undefined === value && $.isString(name)) {
        return this.nodes[0].dataset[name]
      }
      
      if ($.isString(name)) {
        var tmp = {}
        tmp[name] = value
        name = tmp
      }
      
      this.each(function() {
        for (var i in name) {            
          this.dataset[i] = name[i]
        }
      })
      return this
    }
    
    ,attr: function(name, value) {
      if (!this.nodes[0]) {
        return
      }
      if (undefined === value && $.isString(name)) {
        return this.nodes[0].getAttribute(name)
      }
      
      if ($.isString(name)) {
        var tmp = {}
        tmp[name] = value
        name = tmp
      }
      
      this.each(function() {
        for (var i in name) {            
          this.setAttribute(i, name[i])
        }
      }) 
      
      return this
    }
    
    ,removeAttr: function(name) {
      this.each(function() {
        this.removeAttribute(name)
      })
      return this
    }
    
    ,hasClass: function(classes) {
      classes = classes.trim().split(/\s+/)
      for (var i = 0, len = this.nodes.length; i < len; ++i) {
        for (var j = 0, len = classes.length; j < len; ++j) {
          if (!this.nodes[i].classList.contains(classes[j])) {
            return false
          }
        }
      }
      return true
    }
    
    ,addClass: function(classes) {
      return this.attr('class', this.attr('class') + ' ' + classes)
    }
    
    ,removeClass: function(classes) {
      classes = classes.trim().split(/\s+/)
      var i = 0
        ,len = classes.length
        
      this.each(function() {
        for ( ; i < len; ++i) {
          this.classList.remove(classes[i])
        }
      })
      return this
    }
    
    ,toggleClass: function(classes, flag) {
      classes = classes.trim().split(/\s+/)
      if (undefined === flag) {
        this.each(function() {
          node = $(this)
          for (var i = 0, len = classes.length; i < len; ++i) {
            node[node.hasClass(classes[i])? 'removeClass' : 'addClass'](classes[i])
          }
        })
      } else {
        this.each(function() {
          node = $(this)
          var method = flag? 'addClass' : 'removeClass'
          for (var i = 0, len = classes.length; i < len; ++i) {
            node[method](classes[i])
          }
        })
      }
      return this
    }
    
    ,css: function(name, value) {
      if (undefined == value && $.isString(name)) {
        var node = this.nodes[0]
        return node.style[name] || document.defaultView.getComputedStyle(node, '').getPropertyValue(name)
      }
      
      !$.isString(name) || function() {
        var tmp = {}
        tmp[name] = value
        name = tmp
      }()
      
      var css = []
          ,property

      for (var i in name) {
        property = $.str(i).underscore().dasherize()
        
        if (undefined === document.body.style[$.str(property).camelize()]) {
          property = '-' + $.vendorPrefix + '-' + property
        }
        
        css.push(property + ':' + name[i])
      }
      css = css.join(';')
      
      this.each(function() {
        this.style.cssText += ';' + css
      })
      
      return this
    }
    
    ,width: function(value) {
      if (undefined === value) {
        value = parseFloat(this.css('width'))
        return isNaN(value)? 0 : value
      }
      
      return this.css('width', value + 'px')
    }
    
    ,height: function(value) {
      if (undefined === value) {
        value = parseFloat(this.css('height'))
        return isNaN(value)? 0 : value
      }
      
      return this.css('height', value + 'px')
    }
    
    ,offset: function() {
      var node = this.nodes[0]
      
      if (!node) {
        return
      }
      
      return {
        width: node.offsetWidth
        ,height: node.offsetHeight
        ,left: node.offsetLeft
        ,top: node.offsetTop
      }
    }
    
    ,val: function(value, reset) {
      if (undefined === value) {
        var node = this.nodes[0]
        
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
          $(node.elements).each(function(n) {
            n = $(n)
            if (undefined !== value[this.name]) {
              value[this.name] = [value[this.name], n.val()]
            } else {
              value[this.name] = n.val()
            }
          })
          return value
        }
        
        return node.value
      } else {
        this.each(function(node) {
          if (node.multiple) {
            $.isArray(value) || (value = [value])
            
            for (var i = 0, len = value.length; i < len; ++i) {
              value[i] = value[i] + ''
            }
            
            var options = node.options
            
            for (var i = 0, len = options.length; i < len; ++i) {
              options[i].selected  = -1 != value.indexOf(options[i].value)
            }
          } else if ('FORM' == node.nodeName) {
            $(node.elements).each(function(n) {
              n = $(n)
              if (undefined !== value[this.name]) {
                n.val(value[this.name])
              } else if (reset) {
                n.val('')
              }
            })
          } else {  
            switch (node.type) {
              case 'checkbox':
                node.checked = !!value
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
      options || (options = {})
      
      if (!$.isFunction(options)) {
        options = {success: options}
      }  
      
      this.each(function() {
        if ('FORM' != this.nodeName) {
          return
        }
        
        node = $(this)
        
        var ajaxOptions = {
          url: this.action
          ,method: this.method
          ,data: node.val()
        }
        
        $.extend(ajaxOptions, options)
        $.ajax(ajaxOptions)
      })
      return this
    }
  })
  
  $.NodeList = NodeList
})(one)
