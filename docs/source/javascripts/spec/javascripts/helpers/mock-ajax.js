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
        if (typeof items != 'array') {
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