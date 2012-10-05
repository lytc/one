(function() {
  var UNSENT            = 0
      ,OPENED           = 1
      ,HEADERS_RECEIVED = 2
      ,LOADING          = 3
      ,DONE             = 4
      ,_methods = ['OPTIONS', 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'TRACE', 'CONNECT']
      ,_requests = []
      ,MockXMLHttpRequestEvent = function() {
    
      }
      ,MockXMLHttpRequest = function() {
        this.readyState = UNSENT
        this.sent = false
        this.error = false
        this.uploadComplete = false
        this.async = true
    
        this.requestHeaders = {}
        this.responseHeaders = {}
      }
  
  MockXMLHttpRequest.prototype = {
    status: 0
    ,statusText: ''
    ,response: ''
    ,responseText: ''
    ,responseXML: null
    ,responseType: ''
    //,responseBlob: ??
    //,upload: XMLHttpRequestUpload
    ,withCredentials: false
    ,onloadstart: null
    ,onreadystatechange: null
    ,onerror: null
    ,onprogress: null
    ,onloadend: null
    ,onload: null
    ,onabort: null
    
    ,changeReadyState: function(state, dispatchEvent) {
      this.readyState = state
      if (dispatchEvent !== false) {
        this.dispatchEvent('readystatechange')  
      }
    }
    
    ,setRequestHeader: function(name, value) {
      if (this.readyState != OPENED && this.sent) {
        throw new Error('DOMException.INVALID_STATE_ERR')
      }
      
      // @todo: Validate name, value
      
      this.requestHeaders[name] = value
    }
    
    ,getAllResponseHeaders: function() {
      if (this.readyState == UNSENT || this.readyState == OPENED|| this.error) {
        return ''
      }
      
      var result = []
      for (var i in this.responseHeaders) {
        if (/^Set\-Cookie$/i.test(name) || /^Set\-Cookie2$/i.test(name)) {
          continue
        }
        result.push(i + ': ' + this.responseHeaders[i])
      }
      return result.join("\n")
    }
    
    ,getResponseHeader: function(name) {
      if (this.readyState == UNSENT || this.readyState == OPENED|| this.error) {
        return null
      }
      
      if (/^Set\-Cookie$/i.test(name) || /^Set\-Cookie2$/i.test(name)) {
        return null
      }
      
      result = this.responseHeaders[name]
      if (undefined === result) {
        result = null
      }
      
      return result
    }
    
    ,overrideMimeType: function(mime) {
      if (this.readyState == LOADING || this.readyState == DONE) {
        throw Error('DOMException.INVALID_STATE_ERR')
      }
      
      // @todo ??
    }
    
    ,addEventListener: function(eventName, callback, useCapture) {
      this.listeners || (this.listeners = {})
      this.listeners[eventName] || (this.listeners[eventName] = [])
      this.listeners[eventName].push({callback: callback, useCapture: useCapture})
    }
    
    ,removeEventListener: function(eventName, callback, useCapture) {
      if (!this.listeners || this.listeners[eventName]) {
        return
      }
      
      var item
      for (var i=  0; i < this.listeners[eventName].length; ++i) {
        item = this.listeners[eventName][i]
        
        if (item.callback !== callback || item.useCapture !== useCapture) {
          continue
        }
        
        this.listeners[eventName].splice(i, 1)
      }
    }
    
    ,dispatchEvent: function(eventName) {
      !this['on' + eventName] || this['on' + eventName]()
      
      if (!this.listeners || !this.listeners[eventName]) {
        return
      }
      var me = this
      this.listeners[eventName].forEach(function(item) {
        var e = new MockXMLHttpRequestEvent
        e.type = eventName
        item.callback.call(me, e)
      })
    }
    
    ,open: function(method, url, async, username, password) {
      if (-1 == _methods.indexOf(method)) {
        throw Error('DOMException.INVALID_STATE_ERR')
      }
      
      this.method = method
      this.url = url
      this.async = undefined === async? true : async
      
      this.abort()
      this.sent = false
      this.changeReadyState(OPENED)
    }
    
    ,send: function(data) {
      if (this.readyState != OPENED || this.sent) {
        throw Error('DOMException.INVALID_STATE_ERR')
      }
      
      if (null !== data) {
        if (data instanceof ArrayBuffer || data instanceof Blob) {
          this.entityBody = data
        } else if (data instanceof Document) {
          var mineType = data instanceof HTMLDocument? 'text/html' : 'application/xml'
          this.overrideMimeType(mineType)
          this.entityBody = data.innerHTML
        } else if ('string' == typeof data) {
          this.overrideMimeType('text/plain;charset=UTF-8')
          this.entityBody = data
        } else if (data instanceof FormData) {
          this.overrideMimeType('multipart/form-data')
          this.entityBody = data
        }
      }
      
      if (!this.entityBody) {
        this.uploadComplete = true
      }
        
      this.error = false
      this.sent = true
        
      this.dispatchEvent('readystatechange')
      this.dispatchEvent('loadstart')
      this.dispatchEvent('progress')
      this.changeReadyState(this.HEADERS_RECEIVED)
      this.changeReadyState(this.LOADING)
        
      // @todo: If the upload complete flag is unset, fire a progress event named loadstart on the XMLHttpRequestUpload object.
        
        
      // add to _requests
      _requests.push(this)
    }
    
    ,abort: function() {
      if (this.async === false) {
        return
      }
      
      this.error = true
      
      if ((!this.sent && (this.readyState == UNSENT || this.readyState == OPENED)) || this.readyState == DONE) {
        
      } else {
        this.changeReadyState(DONE)
        this.sent = false
        
        this.dispatchEvent('abort')
        this.dispatchEvent('loadend')
        
        this.uploadComplete = true
      }
      
      this.changeReadyState(UNSENT, false)
    }
  }
  
  // Mock server
  var originXMLHttpRequest
  
  var MockServer = {
    start: function() {
      this.XMLHttpRequest = MockXMLHttpRequest
      originXMLHttpRequest = XMLHttpRequest
      XMLHttpRequest = this.XMLHttpRequest
      _requests = []
    }
    
    ,stop: function() {
      XMLHttpRequest = originXMLHttpRequest
      this.XMLHttpRequest = undefined
      _requests = []
    }
    
    ,response: function(response) {
      var request
      
      for (var i = 0, len = _requests.length; i < len; ++i) {
        request = _requests[i]
        if (request.method == response.method && request.url == response.url) {
          _requests.splice(i, 1)
          break
        }
      }
      
      if (!request) {
        return
      }
      
      for (var i in response) {
        request[i] = response[i]
      }
      
      request.status || (request.status = 200)
      request.statusText || (request.statusText = 'ok')
      
      request.dispatchEvent('load')
      request.dispatchEvent('loadend')
    }
  }
  
  window.Mock = {
    XMLHttpRequest: MockXMLHttpRequest
    ,server: MockServer
    ,createXML: function() {
      var items
          ,xml = []
          
      for (var i = 0; i < arguments.length; ++i) {
        items = arguments[i]
        if (typeof item != 'array') {
          items = [items]
        }
        for (var j = 0; j < items.length; ++j) {          
          xml.push(items[i])
        }
      }
      
      if (!xml.length) {
        xml = ['<xml></xml>']
      }
      
      xml = xml.join("\n")
      
      var domParser = new DOMParser
      return domParser.parseFromString(xml, 'application/xml')
    }
  }
})()
;
describe('$.ajax', function() {
  $.ajax.defaultOptions.disableCaching = false
  var server = Mock.server
  
  beforeEach(function() {
    server.start()
  })
  
  afterEach(function() {
    server.stop()
  })
  
  it('default method', function() {
    var onSuccess = jasmine.createSpy()
    
    var ajax = $.ajax('url', {
      onSuccess: onSuccess
    })
    
    server.response({
      method: 'GET'
      ,url: 'url'
      ,responseText: 'ok'
    })
    
    expect(onSuccess).toHaveBeenCalled()
  })
  
  it('event listeners', function() {
    var onStart         = jasmine.createSpy()
        ,onStateChange  = jasmine.createSpy()
        ,onProgress     = jasmine.createSpy()
        ,onAbort        = jasmine.createSpy()
        ,onError        = jasmine.createSpy()
        ,onSuccess      = jasmine.createSpy()
        ,onTimeout      = jasmine.createSpy()
        ,onComplete     = jasmine.createSpy()
        
    var ajax = $.ajax('url', {
      onStart: onStart
      ,onStateChange: onStateChange
      ,onProgress: onProgress
      ,onAbort: onAbort
      ,onError: onError
      ,onSuccess: onSuccess
      ,onTimeout: onTimeout
      ,onComplete: onComplete
    })
    
    server.response({
      method: 'GET'
      ,url: 'url'
      ,responseText: 'ok'
    })
    
    expect(onStart).toHaveBeenCalled()
    expect(onStateChange).toHaveBeenCalled()
    expect(onProgress).toHaveBeenCalled()
    expect(onAbort).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
    expect(onSuccess).toHaveBeenCalled()
    expect(onTimeout).not.toHaveBeenCalled()
    expect(onComplete).toHaveBeenCalled()
  })
  
  it('responseType json', function() {
    var onSuccess = jasmine.createSpy()
    var response  = {foo: 1, bar: 'bar', baz: true}
    var ajax = $.ajax('url', {
      responseType: 'json'
      ,onSuccess: onSuccess
    })
    
    server.response({
      method: 'GET'
      ,url: 'url'
      ,responseText: JSON.stringify(response)
    })
    
    expect(onSuccess).toHaveBeenCalled()
    expect(onSuccess.calls[0].args[0]).toEqual(response)
  })
  
  it('responseType xml', function() {
    var onSuccess = jasmine.createSpy()
    var ajax = $.ajax('url', {
      responseType: 'xml'
      ,onSuccess: onSuccess
    })
    
    server.response({
      method: 'GET'
      ,url: 'url'
      ,response: Mock.createXML()
    })
    
    expect(onSuccess).toHaveBeenCalled()
    expect(onSuccess.calls[0].args[0] instanceof XMLDocument).toBeTruthy()
  })
  
  it('responseType document', function() {
    var onSuccess = jasmine.createSpy()

    var ajax = $.ajax('url', {
      responseType: 'document'
      ,onSuccess: onSuccess
    })
    
    server.response({
      method: 'GET'
      ,url: 'url'
      ,response: document.implementation.createHTMLDocument('')
    })
    
    expect(onSuccess).toHaveBeenCalled()
    expect(onSuccess.calls[0].args[0] instanceof HTMLDocument).toBeTruthy()
  })
  
  it('should throw an error with invalid responseType', function() {
    function request() {
      $.ajax('url', {responseType: 'invalidResponseType'})
    }
    expect(request).toThrow()
  })
  
  it('should throw an error when change responseType with synchronous request', function() {
    function request() {
      $.ajax('url', {responseType: 'invalidResponseType', async: false})
    }
    expect(request).toThrow()
  })
  
  it('response headers', function() {
    var responseHeaders = {
      'Content-Type': 'application/json'
    }
    var ajax = $.ajax('url')
    
    server.response({
      method: 'GET'
      ,url: 'url'
      ,responseText: 'ok'
      ,responseHeaders: responseHeaders
    })
    
    expect(ajax.getResponseHeader('Content-Type')).toEqual(responseHeaders['Content-Type'])
    
    var expectedAllResponseHeaders = []
    for (var i in responseHeaders) {
      expectedAllResponseHeaders.push(i + ': ' + responseHeaders[i])
    }
    expectedAllResponseHeaders = expectedAllResponseHeaders.join("\n")
    expect(ajax.getAllResponseHeaders()).toEqual(expectedAllResponseHeaders)
  })
  
  it('should abort request when onStart resturn false', function() {
    var onStart         = function() {return false}
        ,onStateChange  = jasmine.createSpy()
        ,onProgress     = jasmine.createSpy()
        ,onAbort        = jasmine.createSpy()
        ,onError        = jasmine.createSpy()
        ,onSuccess      = jasmine.createSpy()
        ,onTimeout      = jasmine.createSpy()
        ,onComplete     = jasmine.createSpy()
        
    var ajax = $.ajax('url', {
      onStart: onStart
      ,onStateChange: onStateChange
      ,onProgress: onProgress
      ,onAbort: onAbort
      ,onError: onError
      ,onSuccess: onSuccess
      ,onTimeout: onTimeout
      ,onComplete: onComplete
    })
    
    server.response({
      method: 'GET'
      ,url: 'url'
      ,responseText: 'ok'
    })
    
    expect(onStateChange).toHaveBeenCalled()
    expect(onProgress).toHaveBeenCalled()
    expect(onAbort).toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
    expect(onSuccess).toHaveBeenCalled()
    expect(onTimeout).not.toHaveBeenCalled()
    expect(onComplete).toHaveBeenCalled()
  })
  
  it('cannot call abort with synchronous request', function() {
    var onAbort = jasmine.createSpy()
    var ajax = $.ajax('url', {
      async: false
      ,onAbort: onAbort
    })
    
    ajax.abort()
    expect(onAbort).not.toHaveBeenCalled()
  })
  
  it('onError should called when server return 500', function() {
    var onError = jasmine.createSpy()
    ,ajax = $.ajax('url', {
      onError: onError
    })
    
    server.response({
      method: 'GET'
      ,url: 'url'
      ,status: 500
      ,statusText: 'Internal server error'
    })
    
    expect(onError).toHaveBeenCalled()
  })
  
  it('$.get', function() {
    var onSuccess = jasmine.createSpy()
        ,ajax = $.get('url', onSuccess)
        
    server.response({
      method: 'GET'
      ,url: 'url'
      ,responseText: 'ok'
    })
    
    expect(onSuccess).toHaveBeenCalled()
  })
  
  it('$.getJson', function() {
    var onSuccess = jasmine.createSpy()
        ,ajax = $.getJson('url', onSuccess)
        
    server.response({
      method: 'GET'
      ,url: 'url'
      ,responseText: '[]'
    })
    
    expect(onSuccess).toHaveBeenCalled()
  })
  
  xit('$.getJsonp', function() {
    
  })
  
  it('$.getXml', function() {
    var onSuccess = jasmine.createSpy()
        ,ajax = $.getXml('url', onSuccess)
        
    server.response({
      method: 'GET'
      ,url: 'url'
      ,response: Mock.createXML()
    })
    
    expect(onSuccess).toHaveBeenCalled()
    expect(onSuccess.calls[0].args[0] instanceof XMLDocument).toBeTruthy()
  })
  
  it('$.post', function() {
    var onSuccess = jasmine.createSpy()
        ,ajax = $.post('url', onSuccess)
        
    server.response({
      method: 'POST'
      ,url: 'url'
      ,response: 'ok'
    })
    
    expect(onSuccess).toHaveBeenCalled()
    expect(onSuccess.calls[0].args[0]).toEqual('ok')
  })
  
  xit('$.poll', function() {
    
  })
  
  it('$.ajax GET with data', function() {
    var data = {foo: 'foo', bar : 1, baz: true}
    var ajax = $.ajax({
      url: 'url'
      ,data: data
    })
    
    expect(ajax.url).toEqual($.appendQuery('url', data))
  })
  
  it('$.ajax POST with data', function() {
    var data = {foo: 'foo', bar : 1, baz: true}
    var ajax = $.ajax({
      method: 'POST'
      ,url: 'url'
      ,data: data
    })
    
    expect(ajax.url).toEqual('url')
  })
})
;
describe('$.arr', function() {
  it('pad', function() {
    expect($.arr([]).pad(3, 1).toArray()).toEqual([1, 1, 1])
    expect($.arr([2, 3]).pad(4, 1).toArray()).toEqual([2, 3, 1, 1])
  })
  
  it('padLeft', function() {
    expect($.arr([2, 3]).padLeft(4, 1).toArray()).toEqual([1, 1, 2, 3])
  })
  
  it('uniq', function() {
    expect($.arr([]).uniq().toArray()).toEqual([])
    expect($.arr([1, 2, 3]).uniq().toArray()).toEqual([1, 2, 3])
    expect($.arr([1, 2, 3, 1, 1, 2]).uniq().toArray()).toEqual([1, 2, 3])
  })
  
  it('truthy', function() {
    expect($.arr([]).truthy().toArray()).toEqual([])
    expect($.arr([1, false, true, null, '', undefined, 0, NaN]).truthy().toArray()).toEqual([1, true])
  })
  
  it('falsy', function() {
    expect($.arr([]).truthy().toArray()).toEqual([])
    expect($.arr([1, false, true, null, '', undefined, 0]).falsy().toArray()).toEqual([false, null, '', undefined, 0])
    expect(isNaN($.arr([1, NaN]).falsy().toArray()[0])).toBeTruthy()
  })
  
  it('exclude', function() {
    expect($.arr([]).exclude().toArray()).toEqual([])
    expect($.arr([1, 2, 3, 4]).exclude(1, 3).toArray()).toEqual([2, 4])
    expect($.arr([1, 2, 3, 4]).exclude([1, 3]).toArray()).toEqual([2, 4])
    expect($.arr([1, 2, 3, 4]).exclude(1, [3]).toArray()).toEqual([2, 4])
  })
})
;
describe('$.nodes event', function() {
    it('tracks that addEventListener was called', function() {
        var node = document.createElement('div')
            ,nodes = $(node)

        spyOn(nodes[0], 'addEventListener')

        nodes.on('click', $.noop)
        nodes.on('click', $.noop)

        expect(node.addEventListener).toHaveBeenCalled()
        expect(node.addEventListener.calls.length).toEqual(1)
    })


    it('tracks that removeEventListener was called', function() {
        var node = document.createElement('div')
            ,nodes = $(node)

        spyOn(nodes[0], 'removeEventListener')

        nodes.on('click', $.noop)
        nodes.on('click', $.noop)

        nodes.un('click', $.noop)
        expect(node.removeEventListener).not.toHaveBeenCalled()

        nodes.un('click', $.noop)
        expect(node.removeEventListener).toHaveBeenCalled()
        expect(node.removeEventListener.calls.length).toEqual(1)
    })

    it('tracks that removeEventListener was called with matches selector', function() {
        var node = document.createElement('div')
            ,nodes = $(node)

        spyOn(nodes[0], 'removeEventListener')

        nodes.on('click', '.foo', $.noop)
        nodes.un('click', '.foo', $.noop)

        expect(node.removeEventListener).toHaveBeenCalled()
        expect(node.removeEventListener.calls.length).toEqual(1)
    })

    it('tracks that removeEventListeners was\'t called when not matches callback', function() {
        var node = document.createElement('div')
            ,nodes = $(node)

        spyOn(nodes[0], 'removeEventListener')

        nodes.on('click', $.noop)
        nodes.un('click', function() {})
        expect(node.removeEventListener).not.toHaveBeenCalled()
    })

    it('tracks that removeEventListeners was\'t called when not matches selector', function() {
        var node = document.createElement('div')
            ,nodes = $(node)

        spyOn(nodes[0], 'removeEventListener')

        nodes.on('click', '.foo', $.noop)
        nodes.un('click', '.bar', $.noop)
        expect(node.removeEventListener).not.toHaveBeenCalled()
    })

    it('tracks its number of calls with $.nodes.one', function() {
        var node = document.createElement('div')
            ,nodes = $(node)
            ,callback = jasmine.createSpy()

        var e = {target: node}

        nodes.one('click', callback)
        nodes.trigger('click', e, node)
        nodes.trigger('click', e, node)

        expect(callback).toHaveBeenCalled()
        expect(callback.calls.length).toEqual(1)
    })

    it('should work with selector', function() {
        var node = document.createElement('div')
            ,child = document.createElement('div')
            ,nodes = $(node)
            ,e = {target: child}
            ,callback = jasmine.createSpy()

        child.className = 'foo'
        node.appendChild(child)

        nodes.on('click', '.foo', callback)
        nodes.trigger('click', e, node)

        expect(callback).toHaveBeenCalled()
        expect(callback.calls.length).toEqual(1)
    })
})
;
describe('$.fn', function() {
  it('should work with createAlias', function() {
    var scope
    var obj = {
      callback: function() {
        scope = this
      }
    }
    
    var alias = $.fn.createAlias(obj, 'callback')
    alias()
    expect(scope).toBe(obj)
  })
  
  describe('createBuffered', function() {
    it('should not called', function() {
      var callback = jasmine.createSpy()
      var buffered = $.fn(callback).createBuffered(1)
      buffered()
      expect(callback).not.toHaveBeenCalled()
    })
  
    it('should called', function() {
      var callback = jasmine.createSpy()
      var buffered = $.fn(callback).createBuffered(1)
      buffered()
      var flag = false
      waitsFor(function() {
        return flag
      })
    
      setTimeout(function() {
        flag = true
      }, 2)
    
      runs(function() {
        expect(callback).toHaveBeenCalled()
      })
    })
  
    it('should called with right arguments', function() {
      var callback = jasmine.createSpy()
      var buffered = $.fn(callback).createBuffered(1)
      
      buffered(1, 2, 3)
      var flag = false
      waitsFor(function() {
        return flag
      })
    
      setTimeout(function() {
        flag = true
      }, 2)
    
      runs(function() {
        expect(callback).toHaveBeenCalled()
        expect(callback).toHaveBeenCalledWith(1, 2, 3)
      })
    })
    
    it('should called with right context', function() {
      var scope = {}
      var expectedScope
      var callback = (function() {
        expectedScope = this
      }).bind(scope)
      
      var buffered = $.fn(callback).createBuffered(1)
      
      buffered()
      var flag = false
      waitsFor(function() {
        return flag
      })
    
      setTimeout(function() {
        flag = true
      }, 2)
    
      runs(function() {
        expect(expectedScope).toBe(scope)
      })
    })
    
    it('should called one within the period', function() {
      var callback = jasmine.createSpy()
        ,buffered = $.fn(callback).createBuffered(1)
        buffered()
        buffered()
        
        var flag = false
        waitsFor(function() {
          return flag
        })
        
        setTimeout(function() {
          flag = true
        }, 1)
        
        runs(function() {
          expect(callback.callCount).toEqual(1)
        })
    })
  })
  
  describe('createRepeated', function() {
    it('should not called', function() {
      var callback = jasmine.createSpy()
      var repeated = $.fn(callback).createRepeated(1)
      repeated()
      expect(callback).not.toHaveBeenCalled()
    })
    
    it('should called', function() {
      var callback = jasmine.createSpy()
      var repeated = $.fn(callback).createRepeated(1)
      repeated()
      
      var flag = false
      waitsFor(function() {
        return flag
      })
      
      setTimeout(function() {
        flag = true
      }, 1)
      
      runs(function() {        
        expect(callback).toHaveBeenCalled()
      }) 
    })
    
    it('should repeated', function() {
      var callback = jasmine.createSpy()
      var repeated = $.fn(callback).createRepeated(1)
      repeated()
      
      var flag = false
      waitsFor(function() {
        return flag
      })
      
      setTimeout(function() {
        flag = true
      }, 100)
      
      runs(function() {        
        expect(callback.calls.length).toBeGreaterThan(1)
      }) 
    })
    
    it('should called with right arguments', function() {
      var callback = jasmine.createSpy()
      var repeated = $.fn(callback).createRepeated(1)
      
      repeated(1, 2, 3)
      var flag = false
      waitsFor(function() {
        return flag
      })
    
      setTimeout(function() {
        flag = true
      }, 2)
    
      runs(function() {
        expect(callback).toHaveBeenCalled()
        expect(callback).toHaveBeenCalledWith(1, 2, 3)
      })
    })
    
    it('should called with right context', function() {
      var scope = {}
      var expectedScope
      var callback = (function() {
        expectedScope = this
      }).bind(scope)
      
      var repeated = $.fn(callback).createRepeated(1)
      
      repeated()
      var flag = false
      waitsFor(function() {
        return flag
      })
    
      setTimeout(function() {
        flag = true
      }, 2)
    
      runs(function() {
        expect(expectedScope).toBe(scope)
      })
    })
    
    it('should stop when called stop', function() {
      var callback = jasmine.createSpy()
      var repeated = $.fn(callback).createRepeated(1)
      repeated()
      repeated.stop()
      
      var flag = false
      waitsFor(function() {
        return flag
      })
      
      setTimeout(function() {
        flag = true
      }, 1)
      
      runs(function() {        
        expect(callback).not.toHaveBeenCalled()
      })
    })
  })
  
  describe('createInterceptor', function() {
    it('should work', function() {
      var passedFn = jasmine.createSpy()
      var fn = jasmine.createSpy()
      var intercepter = $.fn(fn).createInterceptor(passedFn)
      intercepter()
      
      expect(passedFn).toHaveBeenCalled()
      expect(fn).toHaveBeenCalled()
    })
    
    it('should passed function called before the original function', function() {
      var lastCalledFrom
          ,passedFn = function() { lastCalledFrom = 'passed fn' }
          ,fn = function() { lastCalledFrom = 'orig fn' }
          ,intercepter = $.fn(fn).createInterceptor(passedFn)
          
      intercepter()
      
      expect(lastCalledFrom).toEqual('orig fn')
    })
    
    it('should not call the original function if the passed function return false', function() {
      var passedFn = function() { return false }
          ,fn = jasmine.createSpy()
          ,intercepter = $.fn(fn).createInterceptor(passedFn)
          
      intercepter()
      
      expect(fn).not.toHaveBeenCalled()
    })
  })
  
  describe('defer', function() {
    it('should called', function() {
      var callback = jasmine.createSpy()
      $.fn(callback).defer()
      
      $.fn(callback).defer()
      expect(callback).not.toHaveBeenCalled()
      
      var flag = false
      waitsFor(function() {
        return flag
      })
      
      setTimeout(function() {
        flag = true
      })
      
      runs(function() {
        expect(callback).toHaveBeenCalled()
      })
    })
  })
})
;
describe('$.Nodes.form', function() {
  var form = $('<form>')
  
  form.append(
    '<input type="hidden" name="hidden1" />',
    '<input type="text" name="text1" />',
    '<input type="password" name="password1" />',

    '<input type="radio" name="radio1" value="radio1" />',
    '<input type="radio" name="radio1" value="radio2" />',
    '<input type="checkbox" name="checkbox1" value="checkbox1" />',
    '<input type="checkbox" name="checkbox1" value="checkbox2" />',
    '<select name="select1"><option value="option1">option1</option><option value="option2">option1</option></select>',
    '<select name="select2" multiple><option value="option1">option1</option><option value="option2">option1</option></select>',
    '<textarea name="textarea1">abc</textarea>',
    '<input type="button" name="button1" />'
  )
  
  describe('val()', function() {
    it('val', function() {
      var val = {
        hidden1: 'hidden1'
        ,text1: 'text1'
        ,password1: 'password1'
        ,radio1: 'radio1'
        ,checkbox1: ['checkbox1']
        ,select1: 'option2'
        ,select2: ['option1', 'option2']
        ,textarea1: 'textarea1'
        ,button1: 'button1'
      }
      
      form.val(val)
      expect(form.val()).toEqual(val)
    })
  })
  
  describe('submit()', function() {
    it('submit()', function() {
      var server = Mock.server
      server.start()
      
      var onSuccess = jasmine.createSpy()
      
      var ajax = form.submit({
        url: 'url'
        ,onSuccess: onSuccess
      })
      
      server.response({
        method: 'GET'
        ,url: 'url'
        ,status: 200
        ,responseText: 'ok'
      })
      
      expect(onSuccess).toHaveBeenCalled()
      
      server.stop()
    })
  })
})
;
beforeEach(function() {
  this.addMatchers({
    customMatcher: function(expected) {

    }
  });
});
describe('$.Nodes', function() {
  it('$.Nodes() should return an array object', function() {
    expect($.isArray($.nodes())).toBeTruthy()
    expect($.isArray($('*'))).toBeTruthy()
  })
  
  var id = $.sequence('id')
      ,count = 5
      ,rootNode = document.createElement('div')
      ,node
      ,childNode
      ,nodes = {}
  
  rootNode.id = id
  
  for (var i = 0; i < count; ++i) {
    nodes[i] = {}
    node = document.createElement('div')
    node.className = 'class' + i
    nodes[i].node = node
    nodes[i].children = {}
    for (var j = 0; j < count; ++j) {
      childNode = document.createElement('div')
      childNode.className = 'class' + i + j
      nodes[i].children[j] = childNode
      node.appendChild(childNode)
    }
    rootNode.appendChild(node)
  }
  
  // index()
  describe('index()', function() {
    it('should be return -1', function() {
      expect($.nodes().index()).toEqual(-1)
    })
  
    it('shoul be return the index', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        for (var i = 0; i < count; ++i) {      
          expect($('.class' + i).index()).toEqual(i)
        }
        rootNode.parentNode.removeChild(rootNode)
      })
    })
  })
  
  // get()
  describe('get()', function() {
    it('should be return the right item', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        for (var i = 0; i < count; ++i) {          
          expect($('#' + id + ' > div').get(0)).toEqual(nodes[0].node)
        }
        expect($('#' + id + ' > div').get(100)).toBeUndefined()
        rootNode.parentNode.removeChild(rootNode)
      })
    })
  })
  
  // item()
  describe('item()', function() {
    it('should be return the right item', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        for (var i = 0; i < count; ++i) {  
          expect($('#' + id + ' > div').item(i).length).toBe(1)        
          expect($('#' + id + ' > div').item(i)).toContain(nodes[i].node)
        }
        expect($('#' + id + ' > div').item(100).length).toBe(0)
        rootNode.parentNode.removeChild(rootNode)
      })
    })
  })
  
  // first()
  describe('first()', function() {
    it('should be return emtpy node list', function() {
      expect($.nodes().first().length).toBe(0)
    })
    
    it('should be return the right item', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        expect($('#' + id + ' > div').first().length).toBe(1)
        expect($('#' + id + ' > div').first()).toContain(nodes[0].node)
        rootNode.parentNode.removeChild(rootNode)
      })
    })
    
    it('with text node', function() {
      var nodes = $('text node<div>text node1</div>text node2<div>text node3</div>text node4')
      expect(nodes.first()[0].innerHTML).toBe('text node1')
      expect(nodes.first(true)[0].textContent).toBe('text node')
    })
  })
  
  // last()
  describe('last()', function() {
    it('should be return emtpy node list', function() {
      expect($.nodes().last().length).toBe(0)
    })
    
    it('should be return the right item', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        expect($('#' + id + ' > div').last().length).toBe(1)
        expect($('#' + id + ' > div').last()).toContain(nodes[count - 1].node)
        rootNode.parentNode.removeChild(rootNode)
      })
    })
  })
  
  // each()
  describe('each()', function() {
    var spy
    beforeEach(function() {
      spy = {callback: function(index, nodes, node) {}}
      spyOn(spy, 'callback')
    })
    
    it('tracks that the callback was called', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        
        $('#' + id + ' > div').each(spy.callback)
        expect(spy.callback).toHaveBeenCalled()
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
    
    it('tracks its number of calls', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        var nodeList = $('#' + id + ' > div')
        nodeList.each(spy.callback)
        expect(spy.callback.calls.length).toEqual(nodeList.length)
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
    
    it('tracks all the arguments of its calls', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        var nodeList = $('#' + id + ' > div')
        nodeList.each(spy.callback)
        for (var i = 0; i < nodeList.length; ++i) {          
          expect(spy.callback).toHaveBeenCalledWith(i, nodeList, nodeList[i])
        }
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
    
    it('allows access to the most recent call', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        var nodeList = $('#' + id + ' > div')
        nodeList.each(spy.callback)
        for (var i = 0; i < nodeList.length; ++i) {          
          expect(spy.callback.mostRecentCall.args[1]).toBe(nodeList)
        }
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
  })
  
  // filter()
  describe('filter()', function() {
    it('filter', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        var nodeList = $('#' + id + ' > div');
        var nodeListFiltered = nodeList.filter(function(index, nodes) {
          return !!(index % 2)
        })
        
        expect(nodeListFiltered.length).toEqual(Math.floor(nodeList.length / 2))
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
  })
  
  // matches
  describe('matches()', function() {
    it('matches', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        var nodeList = $('#' + id + ' > div');
        var matches = nodeList.matches('.class2')
        
        expect(matches.length).toEqual(1)
        expect(matches[0]).toBe(nodes[2].node)
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
  })
  
  // is()
  describe('is()', function() {
    it('is', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        var nodeList = $('#' + id + ' > div');
        expect(nodeList.is(rootNode)).toBeFalsy()
        expect(nodeList.is('div')).toBeTruthy()
        
        for (var i = 0; i < count; ++i) {
          expect(nodeList.is(nodes[i].node)).toBeTruthy()
        }
        
        rootNode.parentNode.removeChild(rootNode)
      })
    }) 
  })
  
  // ancestors()
  describe('ancestors()', function() {
    it('with no arguments', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        var nodeList
        for (var i = 0; i < count; ++i) {
          nodeList = $('.class' + i).ancestors()
          expect(nodeList.length).toBe(1)
          expect(nodeList[0]).toBe(rootNode)
        }
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
    
    it('with level & no selector', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        var nodeList
        for (var i = 0; i < count; ++i) {
          nodeList = $('.class1' + i).ancestors(2)
          expect(nodeList.length).toBe(1)
          expect(nodeList[0]).toBe(rootNode)
        }
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
    
    it('with selector & no level', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        var nodeList
        for (var i = 0; i < count; ++i) {
          nodeList = $('.class1' + i).ancestors('div')
          expect(nodeList.length).toBe(1)
          expect(nodeList[0]).toBe(nodes[1].node)
        }
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
    
    it('with level & selector', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        var nodeList
        for (var i = 0; i < count; ++i) {
          nodeList = $('.class1' + i).ancestors(2, 'div')
          expect(nodeList.length).toBe(1)
          expect(nodeList[0]).toBe(rootNode)
        }
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
  })
  
  // parent()
  describe('parent()', function() {
    it('with no arguments', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        var nodeList
        for (var i = 0; i < count; ++i) {
          nodeList = $('.class' + i).parent()
          expect(nodeList.length).toBe(1)
          expect(nodeList[0]).toBe(rootNode)
        }
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
    
    it('with selector', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        var nodeList
        for (var i = 0; i < count; ++i) {
          nodeList = $('.class' + i).parent('#' + id)
          expect(nodeList.length).toBe(1)
          expect(nodeList[0]).toBe(rootNode)
        }
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
  })
  
  // find()
  describe('find()', function() {
    it('find with no arguments', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        var nodeList = $('#' + id).find()
        expect(nodeList.length).toEqual(count * count + count)
        for (var i = 0; i < count; ++i) {
          expect(nodeList).toContain(nodes[i].node)
          for (var j = 0; j < count; ++j) {
            expect(nodeList).toContain(nodes[i].children[j])
          }
        }
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
    
    it('find with selector', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        
        var nodeList = $('#' + id).find('.class11')
        expect(nodeList.length).toEqual(1)
        expect(nodeList).toContain(nodes[1].children[1])
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
  })
  
  // children()
  describe('children()', function() {
    it('with no arguments', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        
        var nodeList = $('#' + id).children()
        expect(nodeList.length).toEqual(count)
        for (var i = 0; i < count; ++i) {          
          expect(nodeList).toContain(nodes[i].node)
        }
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
    
    it('with selector', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        
        var nodeList = $('#' + id).children('.class1')
        
        expect(nodeList.length).toEqual(1)
        expect(nodeList).toContain(nodes[1].node)
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
  })
  
  // next()
  describe('next()', function() {
    it('with no selector', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        
        var nodeList = $('#' + id + '> .class1').next()
        
        expect(nodeList.length).toEqual(1)
        expect(nodeList).toContain(nodes[2].node)
        
        nodeList = $('#' + id + ' > .class' + (count - 1)).next()
        expect(nodeList.length).toEqual(0)
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
    
    it('with selector', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        
        var nodeList = $('#' + id + '> .class1').next('.class2')
        
        expect(nodeList.length).toEqual(1)
        expect(nodeList).toContain(nodes[2].node)
        
        nodeList = $('#' + id + ' > .class' + (count - 1)).next('div')
        expect(nodeList.length).toEqual(0)
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
  })
  
  // prev()
  describe('prev()', function() {
    it('with no selector', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        
        var nodeList = $('#' + id + '> .class1').prev()
        
        expect(nodeList.length).toEqual(1)
        expect(nodeList).toContain(nodes[0].node)
        
        nodeList = $('#' + id + ' > .class0').prev()
        expect(nodeList.length).toEqual(0)
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
    
    it('with selector', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        
        var nodeList = $('#' + id + '> .class1').prev('.class0')
        
        expect(nodeList.length).toEqual(1)
        expect(nodeList).toContain(nodes[0].node)
        
        nodeList = $('#' + id + ' > .class0').prev('div')
        expect(nodeList.length).toEqual(0)
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
  })
  
  // nextSiblings()
  describe('nextSiblings()', function() {
    it('with no selector', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        
        var index = 1
            ,nodeList = $('#' + id + '> .class' + index).nextSiblings()
        
        expect(nodeList.length).toEqual(count - index - 1)
        for (var i = index + 1; i < count; ++i) {          
          expect(nodeList).toContain(nodes[i].node)
        }
        
        nodeList = $('#' + id + ' > .class' + (count - 1)).nextSiblings()
        expect(nodeList.length).toEqual(0)
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
    
    it('with selector', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        
        var nodeList = $('#' + id + '> .class1').nextSiblings('.class2')
        
        expect(nodeList.length).toEqual(1)
        expect(nodeList).toContain(nodes[2].node)
        
        nodeList = $('#' + id + ' > .class' + (count - 1)).nextSiblings('div')
        expect(nodeList.length).toEqual(0)
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
  })
  
  // prevSiblings()
  describe('prevSiblings()', function() {
    it('with no selector', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        
        var index = 1
            ,nodeList = $('#' + id + '> .class' + index).prevSiblings()
        
        expect(nodeList.length).toEqual(count - (count - index))
        for (var i = index - 1; i >= 0; --i) {          
          expect(nodeList).toContain(nodes[i].node)
        }
        
        nodeList = $('#' + id + ' > .class0').prevSiblings()
        expect(nodeList.length).toEqual(0)
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
    
    it('with selector', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        
        var nodeList = $('#' + id + '> .class2').prevSiblings('.class1')
        
        expect(nodeList.length).toEqual(1)
        expect(nodeList).toContain(nodes[1].node)
        
        nodeList = $('#' + id + ' > .class0').prevSiblings('div')
        expect(nodeList.length).toEqual(0)
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
  })
  
  // append()
  describe('append()', function() {
    it('append html', function() {
      var node = document.createElement('div')
      $(node).append('content')
      expect(node.innerHTML).toBe('content')
      $(node).append('append')
      expect(node.innerHTML).toBe('contentappend')
    })
      
    it('append a single node', function() {
      var node = document.createElement('div')
      var child = document.createElement('div')
      var child2 = document.createElement('div')
      $(node).append(child)
      expect(node.firstElementChild).toBe(child)
      $(node).append(child2)
      expect(node.lastElementChild).toBe(child2)
    })
      
    it('append nodes', function() {
      var node = document.createElement('div')
      var child = document.createElement('div')
      var child2 = document.createElement('div')
      $(node).append([child, child2])
      expect(node.children[0]).toBe(child)
      expect(node.children[1]).toBe(child2)
    })
  })
    
  // prepend()
  describe('prepend()', function() {
    it('prepend html', function() {
      var node = document.createElement('div')
      $(node).prepend('content')
      expect(node.innerHTML).toBe('content')
      $(node).prepend('prepend')
      expect(node.innerHTML).toBe('prependcontent')
    })
      
    it('prepend a single node', function() {
      var node = document.createElement('div')
      var child = document.createElement('div')
      var child2 = document.createElement('div')
      $(node).prepend(child)
      expect(node.firstElementChild).toBe(child)
      $(node).prepend(child2)
      expect(node.firstElementChild).toBe(child2)
    })
      
    it('prepend nodes', function() {
      var node = document.createElement('div')
      var child = document.createElement('div')
      var child2 = document.createElement('div')
      $(node).prepend([child, child2])
      expect(node.children[0]).toBe(child)
      expect(node.children[1]).toBe(child2)
    })
  })
    
  // before()
  describe('before()', function() {
    it('before from html string', function() {
      var node = document.createElement('div')
      var child = document.createElement('div')
      node.appendChild(child)
      $(child).before('text node <div class="child">child</div>')
      expect($.isElement(child.previousElementSibling)).toBeTruthy()
      expect(child.previousElementSibling.previousSibling.textContent).toBe('text node ')
    })
      
    it('before from node', function() {
      var node = document.createElement('div')
      var child = document.createElement('div')
      var before = document.createElement('div')
      node.appendChild(child)
      $(child).before(before)
      expect(child.previousElementSibling).toBe(before)
    })
      
    it('before from nodes', function() {
      var node = document.createElement('div')
      var child = document.createElement('div')
      var before = document.createElement('div')
      var before2 = document.createElement('div')
      node.appendChild(child)
      $(child).before([before, before2])
      expect(child.previousElementSibling).toBe(before2)
      expect(child.previousElementSibling.previousElementSibling).toBe(before)
    })
  })
    
  // after()
  describe('after()', function() {
    it('after from html string', function() {
      var node = document.createElement('div')
      var child = document.createElement('div')
      node.appendChild(child)
      $(child).after('text node <div class="child">child</div>')
      expect(child.nextSibling.textContent).toBe('text node ')
      expect($.isElement(child.nextElementSibling)).toBeTruthy()
    })
      
    it('after from node', function() {
      var node = document.createElement('div')
      var child = document.createElement('div')
      var before = document.createElement('div')
      node.appendChild(child)
      $(child).after(before)
      expect(child.nextElementSibling).toBe(before)
    })
      
    it('next from nodes', function() {
      var node = document.createElement('div')
      var child = document.createElement('div')
      var after = document.createElement('div')
      var after2 = document.createElement('div')
      node.appendChild(child)
      $(child).after([after, after2])
      expect(child.nextElementSibling).toBe(after)
      expect(child.nextElementSibling.nextElementSibling).toBe(after2)
    })
  })
    
  // clone()
  describe('clone()', function() {
    it('clone single node', function() {
      var node = document.createElement('div')
      node.id = 'id'
      var cloned = $(node).clone()
      expect($.isElement(cloned[0])).toBeTruthy()
      expect(cloned[0].id).toBe('')
    })
      
    it('clone node list', function() {
      var node = document.createElement('div')
      var child = document.createElement('div')
      var child2 = document.createElement('div')
      child.className = 'child'
      child2.className = 'child2'
      node.appendChild(child)
      node.appendChild(child2)
      var cloned = $(node.children).clone()
      expect(cloned[0].className).toBe('child')
      expect(cloned[1].className).toBe('child2')
    })
  })
    
  // concat()
  describe('concat()', function() {
    it('concat with selector', function() {
      var node = document.createElement('div')        
      var nodeList = $(node).concat('div')
      expect(nodeList.length).toBe(document.querySelectorAll('div').length + 1)
    })
      
    it('concat with node', function() {
      var node = document.createElement('div')
      var node2 = document.createElement('div')
      var node3 = document.createElement('div')
        
      var nodeList = $(node)
      nodeList.concat(node2, node3)
        
      expect(nodeList.length).toBe(3)
      expect(nodeList[1]).toBe(node2)
      expect(nodeList[2]).toBe(node3)
    })
      
    it('concat with node list', function() {
      var node = document.createElement('div')  
          ,divNodes = document.querySelectorAll('div')
      var nodeList = $(node).concat(divNodes)
          
      expect(nodeList.length).toBe(divNodes.length + 1)
    })
  })
  
  // wrap()
  describe('wrap()', function() {
    it('wrap with connected dom node and no arguments', function() {
      var node = document.createElement('div')
          ,child = document.createElement('div')
      
      node.appendChild(child)    
      var wrapped = $(child).wrap()
      
      expect(child.parentNode.nodeName.toLowerCase()).toBe('div')
    })
    
    it('wrap with connected dom node', function() {
      var node = document.createElement('div')
          ,child = document.createElement('div')
      
      node.appendChild(child)    
      var wrapped = $(child).wrap('<div class="wrap">')
      expect(child.parentNode.nodeName.toLowerCase()).toBe('div')
      expect(child.parentNode.className).toBe('wrap')
    })
    
    it('wrap with disconnected dom node', function() {
      var node = document.createElement('div')
      var wrapped = $(node).wrap()
      expect(node.parentNode.nodeName.toLowerCase()).toBe('div')
    })
    
    it('wrap with complex html', function() {
      var node = document.createElement('div')
      var wrapped = $(node).wrap('text node<div class="wrap">text node 1</div> text node 2<div>text node3</div>')
      expect(node.parentNode.nodeName.toLowerCase()).toBe('div')
      expect(node.parentNode.className).toBe('wrap')
    })
    
    it('wrap with existing dom node', function() {
      var node = document.createElement('div')
      var wrap = document.createElement('div')
      
      var wrapped = $(node).wrap(wrap)
      expect(node.parentNode).toBe(wrap)
    })
    
    it('wrap with node list', function() {
      var node = document.createElement('div')
      var wrap = document.createElement('div')
      var wrap1 = document.createElement('div')
      var wrap2 = document.createElement('div')
      
      var wrapped = $(node).wrap([wrap, wrap1, wrap2])
      expect(node.parentNode).toBe(wrap)
    })
  })
  
  // unwrap()
  describe('unwrap()', function() {
    it('unwrap', function() {
      var node = document.createElement('div')
      var wrap = $.createElement('div')
      var wrapParent = wrap.parentNode
      wrap.appendChild(node)
      $(node).unwrap()
      expect(node.parentNode).toBe(wrapParent)
    })
  })
  
  // html()
  describe('html()', function() {
    it('get html', function() {
      var node = $.createElement('div', {html: 'html content'})
      expect($(node).html()).toBe('html content')
    })
    it('set html', function() {
      var node = $.createElement('div')
      $(node).html('html content')
      expect(node.innerHTML).toBe('html content')
    })
  })
  
  // data()
  describe('data()', function() {
    it('set & get data', function() {
      var node = $.createElement('div')
      $(node).data('foo', 'foo val')
      expect($(node).data('foo')).toBe('foo val')
      $(node).data({bar: 'bar val', baz: 'baz val'})
      expect($(node).data('bar')).toBe('bar val')
      expect($(node).data('baz')).toBe('baz val')
    })
  })
  
  // attr()
  describe('data()', function() {
    it('set & get attr', function() {
      var node = $.createElement('div')
      $(node).attr('foo', 'foo val')
      expect($(node).attr('foo')).toBe('foo val')
      $(node).attr({bar: 'bar val', baz: 'baz val'})
      expect($(node).attr('bar')).toBe('bar val')
      expect($(node).attr('baz')).toBe('baz val')
    })
  })
  
  // hasAttr()
  describe('hasAttr()', function() {
    var node = $($.createElement('div'))
    beforeEach(function() {
      node.attr({
        foo: 'foo'
        ,bar: 'bar'
      })
    })
    
    it('with single attr', function() {
      expect(node.hasAttr('foo')).toBeTruthy()
      expect(node.hasAttr('baz')).toBeFalsy()
    })
    
    it('with array of attrs', function() {
      expect(node.hasAttr(['foo', 'bar'])).toBeTruthy()
      expect(node.hasAttr(['foo', 'baz'])).toBeFalsy()
    })
    
    it('with arguments', function() {
      expect(node.hasAttr('foo', 'bar')).toBeTruthy()
      expect(node.hasAttr('foo', 'baz')).toBeFalsy()
    })
  })
  
  // removeAttr()
  describe('removeAttr()', function() {
    var node = $($.createElement('div'))
    beforeEach(function() {
      node.attr({
        foo: 'foo'
        ,bar: 'bar'
        ,baz: 'baz'
      })
    })
    
    it('with single attr', function() {
      expect(node.hasAttr('foo')).toBeTruthy()
      node.removeAttr('foo')
      expect(node.hasAttr('foo')).toBeFalsy()
    })
    
    it('with array of attrs', function() {
      expect(node.hasAttr(['foo', 'bar'])).toBeTruthy()
      node.removeAttr(['foo', 'bar'])
      expect(node.hasAttr(['foo', 'bar'])).toBeFalsy()
    })
    
    it('with arguments', function() {
      expect(node.hasAttr('foo', 'bar')).toBeTruthy()
      node.removeAttr('foo', 'bar')
      expect(node.hasAttr('foo', 'bar')).toBeFalsy()
    })
  })
  
  // hasClass()
  describe('hasClass()', function() {
    var node1 = $.createElement('div')
    var node2 = $.createElement('div')
    
    beforeEach(function() {
      node1.className = 'foo bar baz'
      node2.className = 'bar baz qux'
    })
    
    var node = $([node1, node2])
    
    it('with single class name', function() {
      expect(node.hasClass('foo')).toBeFalsy()
      expect(node.hasClass('bar')).toBeTruthy()
    })
    
    it('with array of class name', function() {
      expect(node.hasClass(['foo', 'bar'])).toBeFalsy()
      expect(node.hasClass(['bar', 'baz'])).toBeTruthy()
    })
    
    it('with arguments', function() {
      expect(node.hasClass('foo', 'bar')).toBeFalsy()
      expect(node.hasClass('bar', 'baz')).toBeTruthy()
    })
  })
  
  // addClass()
  describe('addClass()', function() {
    var node = $.createElement('div')
    beforeEach(function() {
      node.className = ''
    })
    
    it('with single class name', function() {
      $(node).addClass('foo')
      expect($(node).hasClass('foo')).toBeTruthy()
      $(node).addClass('bar baz')
      expect($(node).hasClass('bar baz')).toBeTruthy()
    })
    
    it('with array of class name', function() {
      $(node).addClass(['foo', 'bar'])
      expect($(node).hasClass(['foo', 'bar'])).toBeTruthy()
    })
    
    it('with arguments', function() {
      $(node).addClass('foo', 'bar')
      expect($(node).hasClass('foo', 'bar')).toBeTruthy()
    })
  })
  
  // removeClass()
  describe('removeClass()', function() {
    var n = $.createElement('div')
        ,node = $(n)
    beforeEach(function() {
      n.className = 'foo bar baz'
    })
    
    it('with single class name', function() {
      node.removeClass('foo')
      expect(node.hasClass('foo')).toBeFalsy()
      node.removeClass('bar baz')
      expect(node.hasClass('bar baz')).toBeFalsy()
    })
    
    it('with array of class name', function() {
      node.removeClass(['foo', 'bar'])
      expect(node.hasClass(['foo', 'bar'])).toBeFalsy()
    })
    
    it('with arguments', function() {
      node.removeClass('foo', 'bar')
      expect(node.hasClass('foo', 'bar')).toBeFalsy()
    })
  })
  
  // toggleClass()
  describe('toggleClass()', function() {
    var n = $.createElement('div')
        ,node = $(n)
    beforeEach(function() {
      n.className = 'foo bar'
    })
    
    it('with single class name', function() {
      node.toggleClass('foo')
      expect(node.hasClass('foo')).toBeFalsy()
      node.toggleClass('baz')
      expect(node.hasClass('baz')).toBeTruthy()
    })
      
    it('with class name separate by space', function() {
      node.toggleClass('foo baz')
      expect(node.hasClass('foo')).toBeFalsy()
      expect(node.hasClass('baz')).toBeTruthy()
    })
      
    it('with array of class name', function() {
      node.toggleClass(['foo', 'baz'])
      expect(node.hasClass('foo')).toBeFalsy()
      expect(node.hasClass('baz')).toBeTruthy()
    })
      
    it('with arguments', function() {
      node.toggleClass('foo', 'baz')
      expect(node.hasClass('foo')).toBeFalsy()
      expect(node.hasClass('baz')).toBeTruthy()
    })
  })
  
  // css()
  describe('css()', function() {
    var node = $($.createElement('div'))
    beforeEach(function() {
      node.attr('style', '')
    })
    
    it('get & set with key value', function() {
      node.css('color', 'red')
      expect(node.css('color')).toBe('red')
    })
    
    it('set with object', function() {
      node.css({
        color: 'red'
        ,backgroundColor: 'blue'
      })
      expect(node.css('color')).toBe('red')
      expect(node.css('background-color')).toBe('blue')
    })
    
    it('with vendor', function() {
      node.css('transition-property', 'width')
      expect(node.css('transition-property')).toBe('width')
    })
  })
  
  // width()
  describe('width()', function() {
    var node = $($.createElement())
    it('get & set', function() {
      node.width(100)
      expect(node.width()).toBe(100)
      node.width('200px')
      expect(node.width()).toBe(200)
      node.width('auto')
      expect(node.width()).toBe(0)
    })
  })
  
  // height()
  describe('height()', function() {
    var node = $($.createElement())
    it('get & set', function() {
      node.height(100)
      expect(node.height()).toBe(100)
      node.height('200px')
      expect(node.height()).toBe(200)
      node.height('auto')
      expect(node.height()).toBe(0)
    })
  })
  
  // top()
  describe('top()', function() {
    var node = $($.createElement())
    it('get & set', function() {
      node.top(100)
      expect(node.top()).toBe(100)
      node.top('200px')
      expect(node.top()).toBe(200)
      node.top('auto')
      expect(node.top()).toBe(0)
    })
  })
  
  // left()
  describe('left()', function() {
    var node = $($.createElement())
    it('get & set', function() {
      node.left(100)
      expect(node.left()).toBe(100)
      node.left('200px')
      expect(node.left()).toBe(200)
      node.left('auto')
      expect(node.left()).toBe(0)
    })
  })
  
  // offset()
  describe('offset()', function() {
    var node = $($.createElement())
    it('get & set', function() {
      node.offset({top: 10, left: 20, width: 30, height: 40})
      expect(node.top()).toBe(10)
      expect(node.left()).toBe(20)
      expect(node.width()).toBe(30)
      expect(node.height()).toBe(40)
    })
  })
})
;
describe('$', function() {
  // $.extend()
  describe('extend()', function() {
    var object = {one: 1, two: 2}
    it('should be returned an copied object', function() {
      expect($.extend({}, object)).toEqual(object)
    })
    it('should be returned an extended object', function() {
      expect($.extend({three: 3}, object)).toEqual({one: 1, two: 2, three: 3})
    })
    it('should be returned an extended object with recusive', function() {
      var object = {foo: {bar: {baz: 1}}}
      var extendedObject = $.extend({}, object, true)
      expect(extendedObject).toEqual({foo: {bar: {baz: 1}}})
      expect(extendedObject).toNotBe(object)
      expect(extendedObject.foo).toNotBe(object.foo)
      expect(extendedObject.foo.bar).toNotBe(object.foo.bar)
    })
  })
  
  // $.noop
  describe('noop', function() {
    it('noop should be a function', function() {
      expect(typeof $.noop).toEqual('function')
    })
    
    it('noop should be noop', function() {
      expect($.noop).toEqual($.noop)
    })
  })
  
  // $.sequence()
  describe('sequence()', function() {
    it('increase 1 when call', function() {
      var sequence = $.sequence()
      expect($.sequence()).toEqual(sequence + 1)
    })
    it('increase 1 when call with prefix', function() {
      var sequence = $.sequence('prefix')
      var number = parseInt(sequence.match(/(\d+)$/)[1])
      expect(parseInt($.sequence('prefix').match(/(\d+)$/)[1])).toEqual(number + 1)
    })
  })
  
  // $.error()
  describe('error()', function() {
    it('return new Error when call', function() {
      var message = 'this is an error'
          ,error = $.error(message)
          
      expect(error instanceof Error).toBeTruthy()
      expect(error.message).toEqual(message)
    })
  })
  
  // $.getType()
  describe('getType()', function() {
    it('should be type string', function() {
      expect($.getType('this is a string')).toEqual('String')
    })
    
    it('should be type number', function() {
      expect($.getType(1)).toEqual('Number')
      expect($.getType(-10.3)).toEqual('Number')
      expect($.getType(NaN)).toEqual('Number')
    })
    
    it ('should be type array', function() {
      expect($.getType([])).toEqual('Array')
    })
    
    it('should be type type function', function() {
      expect($.getType(function(){})).toEqual('Function')
    })
  })
  
  // $.isString()
  describe('isString()', function() {
    it('should be truthy', function() {
      expect($.isString('it me!')).toBeTruthy()
    })
    it('should be falsy', function() {
      expect($.isString(1)).toBeFalsy()
    })
  })
  
  // $.isNumber()
  describe('isNumber()', function() {
    it('should be truthy', function() {
      expect($.isNumber(1)).toBeTruthy()
    })
    it('should be falsy', function() {
      expect($.isNumber('it me!')).toBeFalsy()
    })
  })
  
  // $.isFunction()
  describe('isFunction()', function() {
    it('should be truthy', function() {
      expect($.isFunction(function(){})).toBeTruthy()
    })
    it('should be falsy', function() {
      expect($.isFunction('it me!')).toBeFalsy()
    })
  })
  
  // $.isLikeArray()
  describe('isLikeArray()', function() {
    it('should be truthy', function() {
      expect($.isLikeArray([])).toBeTruthy()
      expect($.isLikeArray(arguments)).toBeTruthy()
    })
    it('should be falsy', function() {
      expect($.isLikeArray('it me!')).toBeFalsy()
    })
  })
  
  // $.isObject()
  describe('isObject()', function() {
    it('shold be truthy', function() {
      expect($.isObject({})).toBeTruthy()
      expect($.isObject(new function(){})).toBeTruthy()
    })
    it('should be falsy', function() {
      expect($.isObject('')).toBeFalsy()
    })
  })
  
  // $.isPlainObject()
  describe('isPlainObject()', function() {
    it('should be truthy', function() {
      expect($.isPlainObject({})).toBeTruthy()
    })
    it('should be falsy', function() {
      expect($.isPlainObject(new function(){})).toBeFalsy()
    })
  })
  
  // $.isNode()
  describe('isNode()', function() {
    it('should be truthy', function() {
      expect($.isNode(document.documentElement)).toBeTruthy()
    })
    it('should be falsy', function() {
      expect($.isNode(window)).toBeFalsy()
    })
  })
  
  // $.isElement()
  describe('isElement()', function() {
    it('should be truthy', function() {
      expect($.isElement(document.querySelector('*'))).toBeTruthy()
    })
    it('shoud be falsy', function() {
      expect($.isElement(document)).toBeFalsy()
    })
  })
  
  // $.isNodeList()
  describe('isNodeList()', function() {
    it('should be truthy', function() {
      expect($.isNodeList(document.querySelectorAll('*'))).toBeTruthy()
    })
    it('should be falsy', function() {
      expect($.isNodeList(document)).toBeFalsy()
    })
  })
  
  // $.isHtmlCollection()
  describe('isHtmlCollection()', function() {
    it('should be truthy', function() {
      expect($.isHtmlCollection(document.forms)).toBeTruthy()
    })
    it('should be falsy', function() {
      expect($.isHtmlCollection(document)).toBeFalsy()
    })
  })
  
  // $.isDefined()
  describe('isDefined()', function() {
    it('should be return true with defined variable', function() {
      expect($.isDefined(this)).toBeTruthy()
    })
    
    window._testIsDefined = {foo: {bar: 1}}
    it('should be return true with defined object property with default context', function() {
      expect($.isDefined('_testIsDefined.foo.bar')).toBeTruthy()
    })
    it('should be return false with undefined pbject property with default context', function() {
      expect($.isDefined('undefined_variable.bar.baz')).toBeFalsy()
    })
    
    var foo = {bar: {baz: 1}}
    it('should be return true with defined object property with custom context', function() {
      expect($.isDefined('bar.baz', foo)).toBeTruthy()
    })
    it('should be return false with undefined object property with custom context', function() {
      expect($.isDefined('bar.bar', foo)).toBeFalsy()
    })
  })
  
  // $.each()
  describe('each()', function() {
    describe('each with array', function() {
      var arr = [1, 2, 3]
          ,spy
          ,callback = function(index, v, o) {
            val = v
          }
          ,callbackReturnFalse = function(index, v, o) {
            val = v
            return false
          }
          ,val
        
      function setup() {
        spy = {
          callback: callback
        }
        spyOn(spy, 'callback')
        $.each(arr, spy.callback)
      }
    
      it('tracks that callback was called', function() {
        setup()
        expect(spy.callback).toHaveBeenCalled()
      })
    
      it('tracks its number of calls', function() {
        setup()
        expect(spy.callback.calls.length).toEqual(arr.length)
      })
    
      it('tracks all the arguments of its calls', function() {
        setup()
        for (var i = 0; i < arr.length; ++i) {        
          expect(spy.callback).toHaveBeenCalledWith(i, arr[i], arr)
        }
      })
    
      it ('should be returned the last item value', function() {
          expect($.each(arr, callback)).toEqual(arr[arr.length-1])
      })
    
      it('should be breaked when callback return false', function() {     
        expect($.each(arr, callbackReturnFalse)).toEqual(arr[0])
        expect(val).toEqual(arr[0])
      }) 
    })
    
    // $.each()
    describe('each with object', function() {
      var o = {one: 1, two: 2, three: 3}
          ,spy
          ,callback = function(index, v, o) {
            val = v
          }
          ,callbackReturnFalse = function(index, v, o) {
            val = v
            return false
          }
          ,val
        
      function setup() {
        spy = {
          callback: callback
        }
        spyOn(spy, 'callback')
        $.each(o, spy.callback)
      }
    
      it('tracks that callback was called', function() {
        setup()
        expect(spy.callback).toHaveBeenCalled()
      })
    
      it('tracks its number of calls', function() {
        setup()
        expect(spy.callback.calls.length).toEqual(Object.keys(o).length)
      })
    
      it('tracks all the arguments of its calls', function() {
        setup()
        for (var i in o) {        
          expect(spy.callback).toHaveBeenCalledWith(i, o[i], o)
        }
      })
    
      it ('should be returned the last item value', function() {
          expect($.each(o, callback)).toEqual(o.three)
      })
    
      it('should be breaked when callback return false', function() {     
        expect($.each(o, callbackReturnFalse)).toEqual(o.one)
        expect(val).toEqual(o.one)
      }) 
    })
  })
  
  // $.map()
  describe('map()', function() {
    it('map with array', function() {
      var result = $.map([1, 2, 3], function() {
        return this + 1
      })
      expect(result).toEqual([2, 3, 4])
    })
    it('map with object', function() {
      var result = $.map({one: 1, two: 2, three: 3}, function() {
        return this + 1
      })
      expect(result).toEqual({one: 2, two: 3, three: 4})
    })
  })
  
  // $.createObject()
  describe('createObject()', function() {
    it('should created a new object', function() {
      expect($.createObject('foo.bar.baz')).toEqual({})
    })
    it('should not override existing object', function() {
      window.foo = {bar: {one: 1}}
      $.createObject('foo.bar.baz')
      expect(window.foo).toEqual({bar: {one: 1, baz: {}}})
    })
    it('with custom scope', function() {
      var object = {foo: {}}
      $.createObject('foo.bar.baz', object)
      expect(object).toEqual({foo: {bar: {baz: {}}}})
    })
  })
  
  // $.createElement()
  describe('createElement()', function() {
    it('should be created a new element', function() {
      var el = $.createElement('div')
      expect($.isElement(el)).toBeTruthy()
    })
    it('should be created a new element with properties', function() {
      var el = $.createElement('div', {class: 'klass'})
      expect(el.getAttribute('class')).toEqual('klass')
    })
  })
  
  // $.toArray()
  describe('toArray()', function() {
    it('should be return an array', function() {
      expect($.isArray($.toArray(arguments))).toBeTruthy()
    })
    
    it('should be return an array with non likeArray argument', function() {
      var result = $.toArray(1)
      expect(result).toEqual([1])
    })
  })
  
  // $.ready()
  describe('ready()', function() {
    
    
    it('tracks that callback was called', function() {
      var spy = {callback: function() {}}
      spyOn(spy, 'callback')
      $.ready(spy.callback)
      expect(spy.callback).toHaveBeenCalled()
    })
    
    it('tracks its number of calls', function() {
      var spy = {callback: function() {}}
      spyOn(spy, 'callback')
      $.ready(spy.callback)
      expect(spy.callback.calls.length).toEqual(1)
    })
  })
  
  // $.query()
  describe('query()', function() {
    var id = $.sequence('id')
        ,div = document.createElement('div')
        ,div1 = document.createElement('div')
        ,div2 = document.createElement('div')
        ,div3 = document.createElement('div')
        ,div4 = document.createElement('div')
    
    div.id = id
    div1.className = 'class1'
    div2.className = 'class2'
    div3.className = 'class3'
    div4.className = 'class4'
    
    div.appendChild(div1)
    div.appendChild(div2)
    div.appendChild(div3)
    div.appendChild(div4)
    
    it('should be the same document.querySelectorAll', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(div)
        expect($.query('*', div)).toEqual(div.querySelectorAll('*'))
        div.parentNode.removeChild(div)
      }) 
    })
    
    it('child combinator', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(div)
        expect($.query('> div', div)).toEqual(document.querySelectorAll('#' + id + ' > div'))
        div.parentNode.removeChild(div)
      }) 
    })
    
    it('adjacent next sibling combinator', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(div)
        expect($.query('+ div', div1)[0]).toEqual(div2)
        div.parentNode.removeChild(div)
      }) 
    })
    
    it('general next sibling combinator', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(div)
        expect($.query('~ .class3', div1)[0]).toEqual(div3)
        div.parentNode.removeChild(div)
      }) 
    })
    
    it('adjacent previous sibling combinator', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(div)
        expect($.query('- div', div2)[0]).toEqual(div1)
        div.parentNode.removeChild(div)
      }) 
    })
    
    it('general previous sibling combinator', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(div)
        expect($.query('<~ .class1', div3)[0]).toEqual(div1)
        div.parentNode.removeChild(div)
      }) 
    })
  })
  
  // $.vendorPrefix
  describe('vendorPrefix', function() {
    it('should be in the list', function() {
      expect(['' ,'moz', 'webkit', 'o', 'ms']).toContain($.vendorPrefix)
    })
  })
})
;
describe('$.str', function() {
  it('should be object type', function() {
    var str = 'this is it'
    str = $.str(str)
    expect($.isObject(str)).toBeTruthy()
    expect(str).toEqual('this is it')
  })
  
  it('camelize', function() {
    expect($.str('ca me li ze').camelize()).toEqual('caMeLiZe')
    expect($.str('ca-me-li-ze').camelize()).toEqual('caMeLiZe')
    expect($.str('ca_me_li_ze').camelize()).toEqual('caMeLiZe')
    expect($.str('ca me-li_ze').camelize()).toEqual('caMeLiZe')
  })
  
  it('underscore', function() {
    expect($.str('un der sco re').underscore()).toEqual('un_der_sco_re')
    expect($.str('un-der-sco-re').underscore()).toEqual('un_der_sco_re')
    expect($.str('unDerScoRe').underscore()).toEqual('un_der_sco_re')
    expect($.str('un der-sco-Re').underscore()).toEqual('un_der_sco_re')
  })
  
  it('dasherize', function() {
    expect($.str('da she ri ze').dasherize()).toEqual('da-she-ri-ze')
    expect($.str('da_she_ri_ze').dasherize()).toEqual('da-she-ri-ze')
    expect($.str('daSheRiZe').dasherize()).toEqual('da-she-ri-ze')
    expect($.str('da she_riZe').dasherize()).toEqual('da-she-ri-ze')
  })
  
  it('format', function() {
    expect($.str('Hi {0}, welcome to {1} !').format(['Lytc', '"One"']))
          .toEqual('Hi Lytc, welcome to "One" !')
          
    expect($.str('Hi {name}, welcome to {lib} !').format({name: 'Lytc', lib: '"One"'}))
          .toEqual('Hi Lytc, welcome to "One" !')
          
    expect($.str('Hi [0], welcome to [1] !').format(['Lytc', '"One"'], /\[([\w_\-]+)\]/g))
          .toEqual('Hi Lytc, welcome to "One" !')
  })
  
  it('escape', function() {
    expect($.str('<div>" content \' &</div>').escape()).toEqual('&lt;div&gt;&quot; content \&apos; &amp;&lt;/div&gt;')
  })
})
;
describe('$.template', function() {
  var html = 'Hi <%= this.name %>, welcome to "<%= this.lib %>" !'
  var tpl = $.template(html)
  
  it('initialize', function() {  
    expect(tpl instanceof $.Template).toBeTruthy()
    expect(tpl.template).toEqual(html)
    expect(tpl.compiledFn).toBe(null)
  })
  
  it('compile', function() {
    tpl.compile()
    expect($.isFunction(tpl.compiledFn)).toBeTruthy()
  })
  
  it('ititialize with data', function() {
    var content = $.template(html, {name: 'Lytc', lib: 'One'})
    expect(content).toEqual('Hi Lytc, welcome to "One" !')
  })
  
  it('render', function() {
    var content = tpl.render({name: 'Lytc', lib: 'One'})
    expect(content).toEqual('Hi Lytc, welcome to "One" !')
  })
  
  it('render with loop', function() {
    var tpl = $.template(
      '<h3>Product</h3>',
      '<ul>',
        '<% for (var i = 0; i < this.items.length; ++i) { %>',
        '<li><%= this.items[i].name %></li>',
        '<% } %>',
      '</ul>'
    )
    var data = {
      items: [
        {name: 'item 1'},
        {name: 'item 2'}
      ]
    }
    
    var content = tpl.render(data)
    var expected = ['<h3>Product</h3>',
      '<ul>',
        '<li>item 1</li>',
        '<li>item 2</li>',
      '</ul>'].join('')
    
    expect(expected).toEqual(content)
  })
  
  it('with $.each', function() {
    var tpl = $.template(
      '<h3>Product</h3>',
      '<ul>',
        '<% $.each(this.items, function() { %>',
        '<li><%= this.name %></li>',
        '<% }) %>',
      '</ul>'
    )
    var data = {
      items: [
        {name: 'item 1'},
        {name: 'item 2'}
      ]
    }
    
    var content = tpl.render(data)
    var expected = ['<h3>Product</h3>',
      '<ul>',
        '<li>item 1</li>',
        '<li>item 2</li>',
      '</ul>'].join('')
    
    expect(expected).toEqual(content)
  })
  
  it('with complex data', function() {
    var tpl = $.template(
      '<h3>Product</h3>',
      '<ul>',
        '<% for (var i = 0; i < this.categories.length; ++i) { %>',
        '<li>',
          '<%= this.categories[i].name %>',
          '<ul>',
            '<% for (var j = 0; j < this.categories[i].items.length; ++j) { %>',
            '<li><%= this.categories[i].items[j].name %></li>',
            '<% } %>',
          '</ul>',
        '</li>',
        '<% } %>',
      '</ul>'
    )
    var data = {
      categories: [
        {
          name: 'Category 1'
          ,items: [
            {name: 'item 1'},
            {name: 'item 2'}
          ]
        },{
          name: 'Category 2'
          ,items: [
            {name: 'item 3'},
            {name: 'item 4'}
          ]
        }
      ]
    }
    
    var content = tpl.render(data)
    var expected = [
        '<h3>Product</h3>',
        '<ul>',
          '<li>',
            'Category 1',
            '<ul>',
              '<li>item 1</li>',
              '<li>item 2</li>',
            '</ul>',
          '</li>',
          '<li>',
            'Category 2',
            '<ul>',
              '<li>item 3</li>',
              '<li>item 4</li>',
            '</ul>',
          '</li>',
        '</ul>'
      ].join('')
    
    expect(expected).toEqual(content)
  })
  
  it('helpers', function() {
    var tpl = $.template('<div><%= this.escape(this.name) %></div>')
    var data = {name: '<b>lytc</b>'}
    var content = tpl.render(data)
    var expected = '<div>&lt;b&gt;lytc&lt;/b&gt;</div>'
    expect(content).toEqual(expected)
  })
})
;


