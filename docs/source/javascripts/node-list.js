(function($) {
  var flattenArgs = function(args, useSpace) {
    var a = []
      ,_a
      
    for (var i = 0; i < args.length; ++i) {
      _a = args[i]
      if (!$.isArray(_a)) {
        if (useSpace) {
          _a = _a.trim().replace(/\s+/g, ' ').split(' ')
        } else {
          _a = [_a]
        }
      }
      a = a.concat(_a)
    }
    return a
  }
  
  var NodeList = function(nodes) {
    nodes || (nodes = [])
    nodes = $.toArray(nodes)
    
    $.extend(nodes, NodeList.fn)
    
    return nodes
  }
  
  NodeList.fn = {
    index: function() {
      if (!this[0]) {
        return -1
      }
      return [].indexOf.call(this[0].parentElement.children, this[0])
    }
    
    ,get: function(index, acceptTextNode) {
      var nodes = this
      if (!acceptTextNode) {
        nodes = this.filter(function() {
          return !$.isTextNode(this)
        })
      }
      
      index > -1 || (index = nodes.length + index)
      return nodes[index]
    }
    
    ,item: function(index, acceptTextNode) {
      return NodeList(this.get(index, acceptTextNode))
    }
    
    ,first: function(acceptTextNode) {
      return this.item(0, acceptTextNode)
    }
    
    ,last: function(acceptTextNode) {
      return this.item(-1, acceptTextNode)
    }
    
    ,each: function(callback) {
      this.forEach(function(node, index, nodes) {
        return callback.call(node, index, nodes, node)
      })
      return this
    }
    
    ,filter: function(callback) {
      var result = []
      
      this.forEach(function(node, index, nodes) {
        if (callback.call(node, index, nodes, node)) {
          result.push(node)
        }
      })
      
      return NodeList(result)
      //return NodeList([].filter.call(this, callback))
    }
    
    ,matches: function(selector) {
      return this.filter(function() {
        return this[$.vendorPrefix? $.vendorPrefix + 'MatchesSelector' : 'matchesSelector'](selector)
      })
    }
    
    ,is: function(what) {
      if ($.isString(what)) {
        return !!this.matches(what).length
      }
      
      if ($.isElement(what)) {
        what = [what]
      }
      
      if ($.isLikeArray(what)) {
        for (var i = 0, len = what.length; i < len; ++i) {
          if (-1 != this.indexOf(what[i])) {
            return true
          }
        }
      }
      return false
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
      
      return NodeList(nodes)
    }
    
    ,parent: function(selector) {
      return this.ancestors(selector)
    }
    
    ,find: function(selector) {
      selector || (selector = '*')
      var nodes = []
      this.each(function() {
        [].forEach.call($.query(selector, this), function(n) {
          nodes.push(n)
        })
      })
      return NodeList(nodes)
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
      return this.find('-> ' + selector)
    }
    
    ,nextSiblings: function(selector) {
      selector || (selector = '*')
      return this.find('~' + selector)
    }
    
    ,prevSiblings: function(selector) {
      selector || (selector = '*')
      return this.find('<~>' + selector)
    }
    
    ,append: function(what) {
      if ($.isString(what)) {
        this.each(function() {
          this.innerHTML += what
        })
      } else {
        this.each(function() {
          var node = this
          $(what).each(function() {
            var child = this
            node.appendChild(child)
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
        this.each(function() {
          var node = this
            ,children = $(what)
          
          children.reverse()
            
          $(children).each(function() {
            var child = this
            node.insertBefore(child, node.firstChild)
          })
        })
      }
      return this
    }
    
    ,before: function(el) {
      var node
          ,nodes
      this.each(function() {
          node = this
          nodes = $(el)
        
        nodes.each(function() {
            node.parentNode.insertBefore(this, node)
        })
      })
      return this
    }
    
    ,after: function(el) {
      var node
          ,nodes
      this.each(function() {
        node = this
        nodes = $(el) 
        nodes.reverse()
        nodes.each(function() {
            node.parentNode.insertBefore(this, node.nextSibling)
        })     
      })
      return this
    }
    
    ,clone: function() {
      var node
      return $.map(this, function() {
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
        
        } else if ($.isNode(item)) {
          me.push(item)
        }
      })
      
      return this
    }
    
    ,wrap: function(el) {
      el || (el = '<div>')
      
      this.each(function() {
        $(el).first().append(this)
      })
      return this
    }
    
    ,unwrap: function() {
      var parent
      this.each(function() {
        parent = this.parentNode
        if (!parent || !parent.parentNode) {
          return
        }
        $(parent.childNodes).each(function() {
          $(parent).before(this)
        })
        $(parent).destroy()
      })
    }
    
    ,destroy: function() {
      this.each(function() {
        for (var i in this) {
          delete this[i]
        }
        
        if (this.parentNode) {
          this.parentNode.removeChild(this)
        }
      })
    }
    
    ,html: function(html) {
      if (undefined === html) {
        if (this[0]) {
          return this[0].innerHTML
        }
      } else {
        this.each(function() {
          this.innerHTML = html
        })
      }
      return this
    }
    
    ,data: function(name, value) {
      if (!this[0]) {
        return
      }
      
      if (undefined === value && $.isString(name)) {
        return this[0].dataset[name]
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
      if (!this[0]) {
        return
      }
      if (undefined === value && $.isString(name)) {
        return this[0].getAttribute(name)
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
    
    ,hasAttr: function(name) {
      var node = this[0]
      
      if (!node) {
        return
      }
      
      var attrs = flattenArgs(arguments)
          ,i = 0
          ,len = attrs.length
      
      for (; i < len; ++i) {
        if (!node.hasAttribute(attrs[i])) {
          return false
        }
      }
      
      return true
    }
    
    ,removeAttr: function(name) {
      var attrs = flattenArgs(arguments)
          ,i
          ,len = attrs.length
      
      this.each(function() {
        for (i = 0; i < len; ++i) {          
          this.removeAttribute(attrs[i])
        }
      })
      return this
    }
    
    ,hasClass: function() {
      var cls = flattenArgs(arguments, true)
          ,result = true
          ,i
          ,len = cls.length
          
      this.each(function() {
        for (i = 0; i < len; ++i) {          
          if (!this.classList.contains(cls[i])) {
            return result = false
          }
        }
      })
      
      return result
    }
  }
  
  $.NodeList = NodeList
})(one)