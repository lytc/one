one = (function() {
  var slice = [].slice
    ,tmpNode
  
  var $ = function(what, scope) {
    if (what instanceof $.NodeList) {
      return what
    }
    
    if ($.isString(what)) {
      if (/\<\w+(.*)\>/.test(what)) {
        tmpNode || (tmpNode = $.createElement('div'))
        tmpNode.innerHTML = what
        what = tmpNode.children
      } else {
        parent = scope || document
        what = parent.querySelectorAll(what)
      } 
    } else if ($.isFunction(what)) {
      return $.fn(what)
    }
    
    if ($.isNode(what) || $.isNodeList(what) || $.isHtmlCollection(what) || $.isArray(what)) {
      return new $.NodeList(what)
    }
  }
  
$.extend = function(target/*, sources*//*, recusive*/) {
    var sources = slice.call(arguments, 1)
        ,recusive = sources.pop()
        ,item

    if (recusive !== true) {
      sources.push(recusive)
    }
    
    if (!sources.length) {
      sources = target
      target = {}
      recusive = true
    }
    
    sources.forEach(function(source) {
      for (var key in source) {
        item = source[key]
        if (recusive && item instanceof Object && item.__proto__ == Object.prototype) {
          target[key] = $.extend({}, item, true)
        } else {          
          target[key] = item
        }
      }
    })
    return target
  }
  
  $.extend($, {
    noop: function() {}
    
    ,sequence: function() {
      var counter = 0
      var counterPrefixes = {}
      
      return function(prefix) {
        if (!prefix) {
          return counter ++
        }
      
        counterPrefixes[prefix] || (counterPrefixes[prefix] = 0)
        return (prefix? prefix : '') + counterPrefixes[prefix]++
      }
    }()
    
    ,error: function(message) {
      return new Error(message)
    }
    
    ,getType: function(o) {
      return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1]
    }
    
    ,isString: function(o) {
      return typeof o == 'string'
    }
    
    ,isNumber: function(o) {
      return typeof o == 'number'
    }
    
    ,isFunction: function(o) {
      return typeof o == 'function'
    }
    
    ,isArray: function(o) {
      return o instanceof Array
    }
    
    ,isLikeArray: function(o) {
      if (!o) {
        return false
      }
      return $.isArray(o) || $.isNodeList(o) || $.isHtmlCollection(o) || o.callee
    }
    
    ,isObject: function(o) {
      return o instanceof Object
    }
    
    ,isPlainObject: function(o) {
      return $.isObject(o) && o.__proto__ == Object.prototype
    }
    
    ,isNode: function(o) {
      return o instanceof Node
    }
    
    ,isElement: function(o) {
      return o instanceof Element
    }
    
    ,isNodeList: function(o) {
      return o instanceof NodeList
    }
    
    ,isHtmlCollection: function(o) {
      return o instanceof HTMLCollection
    }
    
    ,each: function(o, callback) {
      var result
      if ($.isLikeArray(o)) {
        for (var i = 0, len = o.length; i < len; ++i) {
          result = o[i]
          if (false === callback.call(result, i, result, o)) {
            break
          }
        }
      } else {
        for (var i in o) {
          result = o[i]
          if (false === callback.call(result, i, result, o)) {
            break
          }
        }
      }
      return result
    }
    
    ,map: function(o, callback) {
      var result
      
      if ($.isLikeArray(o)) {
        result = []
        for (var i = 0, len = o.length; i < len; ++i) {
          result.push(callback.call(o[i], i, o[i], o))
        }
      } else {
        result = {}
        for (var i in o) {
          result[i] = callback.call(o[i], i, o[i], o)
        }
      }
      return result
    }
    
    ,createObject: function(names, scope) {
      var parts = names.split('.')
        ,i = 0
        ,len = parts.length
        ,tmp = scope || window
        ,part
        
      for ( ; i < len; ++i) {
        part = parts[i]
        tmp[part] || (tmp[part] = {})
        tmp = tmp[part]
      }
      
      return tmp
    }
    
    ,createElement: function(name, properties) {
      var dom = document.createElement(name)
      if (properties) {
        for (var property in properties) {
          dom.setAttribute(property, properties[property])
        }
      }
      return dom
    }
    
    ,toArray: function(o) {
      if (!$.isLikeArray(o)) {
        o = arguments
        console.log(o)
      }
      
      var result = []
      for (var i = 0, len = o.length; i < len; ++i) {
        result.push(o[i])
      }
      return result
    }
    
    ,ready: function() {
      var isReady = false
      ,callbacks = []
      
      document.addEventListener('DOMContentLoaded', function() {
        isReady = true
        for (var i = 0, len = callbacks.length; i < len; ++i) {
          callbacks[i]()
        }
      }, false)
      
      return function(callback) {
        if (isReady) {
          return callback()
        }
        
        callbacks.push(callback)
      }
    }()
    
    ,query: function(selector, root) {
      root || (root = document)
      switch (selector[0]) {
        case '>':
        case '+':
        case '~':
          if (!root.id) {
            var id = $.sequence('id-')
            root.id = id
          }
        
          selector = '#' + root.id + selector
          
          var nodes = document.querySelectorAll(selector)
          !id || root.removeAttribute('id')
          return nodes
          
        case '-':
          var index = $(root).index()
            ,parent = root.parentElement
            return $.query(selector.substr(1) + ':nth-child(' + index + ')', parent)
          
        case '<':
          if (selector[1] == '~') {
            var index = $(root).index()
              ,nodes = $.query(selector.substr(2), root.parentElement)
              ,result = []
            
            for (var i = 0, len = nodes.length; i < len; ++i) {
              if ($(nodes[i]).index() >= index) {
                break
              }
              result.push(nodes[i])
            }
            return result
          }
          
        default:
          return root.querySelectorAll(selector)
      }
    }
  })
  
  var ua = navigator.userAgent
  ,test = function(regex) {
    return regex.test(ua)
  }
  ,isWebkit = test(/webkit/i)
  ,isFirefox = test(/firefox/i)
  ,isChrome = test(/chrome/i)
  ,isSafari = !isChrome && test(/sarafi/i)
  ,isOpera = test(/opera/i)
  
  $.extend($, {
    isFirefox: isFirefox
    ,isWebkit: isWebkit
    ,isChrome: isChrome
    ,isSafari: isSafari
    ,isOpera: isOpera
    
    ,vendorPrefix: function() {
      return  isFirefox?  'moz' : 
              isWebkit?   'webkit' :
              isOpera?    'o' : ''
    }()
  })
  
  
  return $
})()

window.$ || (window.$ = one)
